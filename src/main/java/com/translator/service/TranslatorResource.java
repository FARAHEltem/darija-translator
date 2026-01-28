package com.translator.service;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

@Path("/translator")
public class TranslatorResource {
    
    private static final String GEMINI_API_KEY = "AIzaSyD2R6LPjWI0Iaqfk5B6h1uqqTtOWoMl1YA";
    
    // gemini-2.5-flash avec v1beta
    private static final String GEMINI_API_URL = 
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;
    
    @POST
    @Path("/translate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response translate(TranslationRequest request) {
        try {
            String englishText = request.getText();
            
            if (englishText == null || englishText.trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"Text cannot be empty\"}")
                    .build();
            }
            
            String darijaTranslation = translateWithGemini(englishText);
            
            TranslationResponse response = new TranslationResponse();
            response.setEnglish(englishText);
            response.setDarija(darijaTranslation);
            response.setStatus("success");
            
            return Response.ok(response).build();
            
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("{\"error\": \"" + e.toString().replace("\"", "'") + "\"}")
                .build();
        }
    }
    
    private String translateWithGemini(String englishText) throws Exception {
        String prompt = "Translate the following English text to Moroccan Arabic Dialect (Darija). " +
                       "Use Arabic script. Only provide the translation, nothing else: " + englishText;
        
        JSONObject requestBody = new JSONObject();
        JSONArray contents = new JSONArray();
        JSONObject content = new JSONObject();
        JSONArray parts = new JSONArray();
        JSONObject part = new JSONObject();
        
        part.put("text", prompt);
        parts.put(part);
        content.put("parts", parts);
        contents.put(content);
        requestBody.put("contents", contents);
        
        System.out.println("Sending request to: " + GEMINI_API_URL);
        System.out.println("Request body: " + requestBody.toString());
        
        URL url = new URL(GEMINI_API_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);
        
        // Envoyer la requête
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestBody.toString().getBytes("utf-8");
            os.write(input, 0, input.length);
        }
        
        // Vérifier le code de réponse
        int responseCode = conn.getResponseCode();
        System.out.println("Response Code from Google: " + responseCode);
        
        if (responseCode != 200) {
            // Si ce n'est pas 200 (OK), on lit le message d'erreur de Google
            BufferedReader errorReader = new BufferedReader(
                new InputStreamReader(conn.getErrorStream(), "utf-8"));
            StringBuilder errorMsg = new StringBuilder();
            String line;
            while ((line = errorReader.readLine()) != null) {
                errorMsg.append(line);
            }
            errorReader.close();
            String errorDetails = errorMsg.toString();
            System.err.println("Google API Error: " + errorDetails);
            throw new Exception("Erreur Google API (" + responseCode + "): " + errorDetails);
        }
        
        // Lire la réponse (seulement si code 200)
        StringBuilder response = new StringBuilder();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), "utf-8"))) {
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
        }
        
        System.out.println("Google API Response: " + response.toString());
        
        // Parser la réponse JSON
        JSONObject jsonResponse = new JSONObject(response.toString());
        
        // Vérifier si la réponse contient des candidats
        if (!jsonResponse.has("candidates") || jsonResponse.getJSONArray("candidates").length() == 0) {
            throw new Exception("No translation candidates returned from API");
        }
        
        String translation = jsonResponse
            .getJSONArray("candidates")
            .getJSONObject(0)
            .getJSONObject("content")
            .getJSONArray("parts")
            .getJSONObject(0)
            .getString("text");
        
        return translation.trim();
    }
    
    // Classe interne pour la requête
    public static class TranslationRequest {
        private String text;
        
        public String getText() {
            return text;
        }
        
        public void setText(String text) {
            this.text = text;
        }
    }
    
    // Classe interne pour la réponse
    public static class TranslationResponse {
        private String english;
        private String darija;
        private String status;
        
        public String getEnglish() {
            return english;
        }
        
        public void setEnglish(String english) {
            this.english = english;
        }
        
        public String getDarija() {
            return darija;
        }
        
        public void setDarija(String darija) {
            this.darija = darija;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
}