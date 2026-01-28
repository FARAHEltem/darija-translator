# 🧪 Guide de Test - Darija Translator Extension

## 📋 Table des matières
1. [Tests de l'API REST](#tests-api-rest)
2. [Tests de l'Extension Chrome](#tests-extension)
3. [Tests des fonctionnalités vocales](#tests-vocaux)
4. [Checklist complète](#checklist)

---

## 🔧 Tests de l'API REST

### Test 1 : Sans authentification (devrait échouer)

**PowerShell :**
```powershell
$headers = @{ "Content-Type" = "application/json" }
$body = @{ text = "Hello" } | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate" -Method Post -Headers $headers -Body $body
    Write-Host "❌ ÉCHEC: La requête a réussi sans authentification!" -ForegroundColor Red
} catch {
    Write-Host "✅ RÉUSSI: Authentification requise (401)" -ForegroundColor Green
}
```

**cURL (CMD) :**
```cmd
curl -X POST "http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate" ^
  -H "Content-Type: application/json" ^
  -d "{\"text\": \"Hello\"}"
```

**Résultat attendu :** `401 Unauthorized`

---

### Test 2 : Avec mauvais credentials (devrait échouer)

**PowerShell :**
```powershell
$username = "wronguser"
$password = "wrongpass"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(("{0}:{1}" -f $username,$password)))

$headers = @{
    "Authorization" = "Basic $base64AuthInfo"
    "Content-Type" = "application/json"
}
$body = @{ text = "Hello" } | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate" -Method Post -Headers $headers -Body $body
    Write-Host "❌ ÉCHEC: La requête a réussi avec de mauvais credentials!" -ForegroundColor Red
} catch {
    Write-Host "✅ RÉUSSI: Credentials invalides (401)" -ForegroundColor Green
}
```

**Résultat attendu :** `401 Unauthorized`

---

### Test 3 : Avec bons credentials (devrait réussir)

**PowerShell :**
```powershell
$username = "translator"
$password = "password123"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes(("{0}:{1}" -f $username,$password)))

$headers = @{
    "Authorization" = "Basic $base64AuthInfo"
    "Content-Type" = "application/json"
}
$body = @{ text = "Hello, how are you?" } | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate" -Method Post -Headers $headers -Body $body

Write-Host "`n✅ RÉUSSI: Traduction obtenue" -ForegroundColor Green
Write-Host "English: $($response.english)" -ForegroundColor White
Write-Host "Darija: $($response.darija)" -ForegroundColor Cyan
Write-Host "Status: $($response.status)" -ForegroundColor Yellow
```

**cURL (CMD) :**
```cmd
curl -X POST "http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate" ^
  -u translator:password123 ^
  -H "Content-Type: application/json" ^
  -d "{\"text\": \"Hello, how are you?\"}"
```

**Résultat attendu :**
```json
{
  "darija": "كيف داير؟ لاباس؟",
  "english": "Hello, how are you?",
  "status": "success"
}
```

---

### Test 4 : Phrases de test variées

**Phrases à tester :**

| Phrase anglaise | Traduction attendue (approximative) |
|----------------|-------------------------------------|
| "Good morning" | "صباح الخير" |
| "Thank you" | "شكرا" |
| "How are you?" | "كيف داير؟" |
| "What's your name?" | "شنو سميتك؟" |
| "See you later" | "نشوفك من بعد" |

---

## 🌐 Tests de l'Extension Chrome

### Test 1 : Installation

**Étapes :**
1. Ouvrir `chrome://extensions/`
2. Activer le Mode développeur
3. Charger l'extension non empaquetée
4. Vérifier que l'icône apparaît dans la barre d'outils

**Résultat attendu :** ✅ Extension visible et active

---

### Test 2 : Ouverture du Side Panel

**Étapes :**
1. Cliquer sur l'icône de l'extension
2. Le side panel devrait s'ouvrir à droite

**Résultat attendu :** ✅ Side panel ouvert avec interface complète

---

### Test 3 : Traduction texte basique

**Étapes :**
1. Ouvrir le side panel
2. Taper "Hello, how are you?" dans le champ de texte
3. Cliquer sur "🔄 Translate to Darija"
4. Attendre le résultat

**Résultat attendu :**
- ✅ Loader affiché pendant la traduction
- ✅ Traduction en arabe affichée
- ✅ Boutons "Copy" et "Read Aloud" visibles

---

### Test 4 : Récupération de texte sélectionné

**Étapes :**
1. Ouvrir n'importe quelle page web
2. Sélectionner du texte anglais
3. Ouvrir le side panel
4. Cliquer sur "📋 Get Selected Text"

**Résultat attendu :**
- ✅ Le texte sélectionné apparaît dans le champ
- ✅ Message d'erreur si aucun texte sélectionné

---

### Test 5 : Copier la traduction

**Étapes :**
1. Traduire un texte
2. Cliquer sur "📋 Copy"
3. Coller dans un autre champ (Ctrl+V)

**Résultat attendu :**
- ✅ Bouton affiche "✅ Copied!" pendant 2 secondes
- ✅ Texte arabe collé correctement

---

### Test 6 : Effacer tout

**Étapes :**
1. Avoir du texte et une traduction affichés
2. Cliquer sur "🗑️ Clear"

**Résultat attendu :**
- ✅ Champ de texte vidé
- ✅ Traduction cachée
- ✅ Erreurs cachées
- ✅ Focus sur le champ de texte

---

### Test 7 : Raccourci clavier (Ctrl+Enter)

**Étapes :**
1. Taper du texte dans le champ
2. Appuyer sur Ctrl+Enter

**Résultat attendu :**
- ✅ Traduction lancée automatiquement

---

## 🎤 Tests des fonctionnalités vocales

### Test 8 : Reconnaissance vocale (Speech-to-Text)

**Étapes :**
1. Ouvrir le side panel
2. Cliquer sur "🎤 Speak in English"
3. Autoriser l'accès au microphone (si demandé)
4. Parler en anglais : "Hello, how are you?"
5. Attendre la reconnaissance

**Résultat attendu :**
- ✅ Bouton devient bleu avec animation
- ✅ Indicateur "Listening..." affiché
- ✅ Texte reconnu apparaît dans le champ
- ✅ Traduction se lance automatiquement

**Erreurs possibles :**
- ❌ "Voice not supported" → Utiliser Chrome/Edge
- ❌ "Microphone permission denied" → Autoriser dans les paramètres Chrome
- ❌ "No speech detected" → Parler plus fort

---

### Test 9 : Text-to-Speech (Read Aloud)

**Étapes :**
1. Traduire un texte en darija
2. Cliquer sur "🔊 Read Aloud"
3. Écouter

**Résultat attendu :**
- ✅ Bouton "Read Aloud" caché
- ✅ Bouton "⏹️ Stop" affiché
- ✅ Audio joué en arabe
- ✅ Bouton "Read Aloud" réapparaît à la fin

**Test de qualité audio :**
- Tester avec différentes phrases
- Vérifier la prononciation
- Vérifier la vitesse (0.85x)

---

### Test 10 : Stop pendant la lecture

**Étapes :**
1. Lancer "Read Aloud"
2. Cliquer sur "⏹️ Stop" pendant la lecture

**Résultat attendu :**
- ✅ Audio s'arrête immédiatement
- ✅ Bouton "Read Aloud" réapparaît

---

### Test 11 : Voice-to-Voice complet

**Étapes complètes :**
1. Cliquer sur "🎤 Speak in English"
2. Parler : "Good morning, I hope you're having a great day"
3. Attendre la reconnaissance
4. Attendre la traduction automatique
5. Cliquer sur "🔊 Read Aloud"
6. Écouter la traduction en darija

**Résultat attendu :**
- ✅ Pipeline complet fonctionne sans intervention
- ✅ Temps de réponse < 5 secondes
- ✅ Audio clair et compréhensible

---

### Test 12 : Tests de reconnaissance vocale avec bruit

**Conditions :**
- Environnement calme
- Environnement avec bruit de fond
- Vitesse de parole lente
- Vitesse de parole rapide
- Accent prononcé

**Résultat attendu :**
- ✅ Fonctionne dans des conditions normales
- ⚠️ Peut échouer avec trop de bruit

---

## ⚙️ Tests de Configuration

### Test 13 : Modifier les paramètres

**Étapes :**
1. Ouvrir le side panel
2. Cliquer sur "⚙️ Settings"
3. Modifier l'URL de l'API
4. Modifier username/password
5. Cliquer sur "💾 Save"
6. Fermer et rouvrir l'extension

**Résultat attendu :**
- ✅ Paramètres sauvegardés
- ✅ Bouton affiche "✅ Saved!"
- ✅ Paramètres persistent après réouverture

---

### Test 14 : Test avec URL invalide

**Étapes :**
1. Mettre une URL invalide dans les paramètres
2. Essayer de traduire

**Résultat attendu :**
- ✅ Message d'erreur clair affiché
- ✅ "API endpoint not found"

---

### Test 15 : Test avec credentials invalides

**Étapes :**
1. Mettre de mauvais credentials dans les paramètres
2. Essayer de traduire

**Résultat attendu :**
- ✅ Message d'erreur : "Authentication failed"

---

## 🧪 Tests de Postman

### Collection Postman à créer

**Requête 1 : Sans Auth**
```
POST http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate
Headers: Content-Type: application/json
Body: {"text": "Hello"}
Expected: 401 Unauthorized
```

**Requête 2 : Avec Auth - Phrase courte**
```
POST http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate
Auth: Basic (translator / password123)
Body: {"text": "Hello"}
Expected: 200 OK + translation
```

**Requête 3 : Avec Auth - Phrase longue**
```
POST http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate
Auth: Basic (translator / password123)
Body: {"text": "Good morning, I hope you're having a wonderful day and everything is going well for you!"}
Expected: 200 OK + translation
```

**Requête 4 : Texte vide**
```
POST http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate
Auth: Basic (translator / password123)
Body: {"text": ""}
Expected: 400 Bad Request
```

---

## ✅ Checklist complète du projet

### API REST
- [ ] ✅ Service REST implémenté (JAX-RS)
- [ ] ✅ Intégration Google Gemini
- [ ] ✅ Authentification Basic Auth activée
- [ ] ✅ Utilisateur créé dans WildFly
- [ ] ✅ Test sans auth → 401
- [ ] ✅ Test avec auth → 200
- [ ] ✅ Test Postman réussi
- [ ] ✅ Test cURL réussi

### Client PHP
- [ ] ✅ Client PHP créé
- [ ] ✅ Authentification Basic Auth
- [ ] ✅ Test avec serveur local

### Extension Chrome
- [ ] ✅ Extension installée
- [ ] ✅ Side Panel fonctionne
- [ ] ✅ Traduction texte OK
- [ ] ✅ Get Selected Text OK
- [ ] ✅ Copy Translation OK
- [ ] ✅ Clear fonctionne
- [ ] ✅ Raccourci Ctrl+Enter OK

### Fonctionnalités vocales
- [ ] ✅ Speech-to-Text implémenté
- [ ] ✅ Reconnaissance vocale testée
- [ ] ✅ Text-to-Speech implémenté
- [ ] ✅ Read Aloud testé
- [ ] ✅ Voice-to-Voice pipeline complet
- [ ] ✅ Stop audio fonctionne

### Configuration
- [ ] ✅ Paramètres modifiables
- [ ] ✅ Paramètres sauvegardés
- [ ] ✅ Gestion d'erreurs complète

### Documentation
- [ ] ✅ README créé
- [ ] ✅ Guide de test créé
- [ ] ✅ Captures d'écran prises
- [ ] ✅ Vidéo de démonstration (optionnel)

---

## 📸 Captures d'écran à prendre

### Pour le rapport

1. **Architecture globale**
   - Schéma : Extension ↔ API REST ↔ Gemini AI

2. **API REST**
   - Postman sans auth (401)
   - Postman avec auth (200 + traduction)
   - Code source TranslatorResource.java

3. **Extension Chrome**
   - Interface principale avec tous les éléments
   - Reconnaissance vocale en cours (bouton bleu + "Listening")
   - Traduction affichée en arabe
   - Panneau de configuration

4. **Tests**
   - Console Chrome avec logs
   - WildFly logs
   - Tests PowerShell

5. **Configuration WildFly**
   - Fichier web.xml
   - Fichier jboss-web.xml
   - Commande add-user.bat

---

## 🎬 Scénario de démonstration vidéo

**Durée : 2-3 minutes**

1. **Introduction (10s)**
   - Présenter l'extension

2. **Démonstration texte (30s)**
   - Taper du texte
   - Cliquer sur Translate
   - Montrer la traduction

3. **Démonstration vocale (40s)**
   - Cliquer sur le microphone
   - Parler en anglais
   - Montrer la reconnaissance
   - Montrer la traduction automatique

4. **Démonstration Read Aloud (20s)**
   - Cliquer sur Read Aloud
   - Écouter la traduction

5. **Démonstration Voice-to-Voice (30s)**
   - Pipeline complet sans interruption
   - Parole → Traduction → Audio

6. **Configuration (20s)**
   - Montrer le panneau Settings
   - Expliquer la personnalisation

7. **Conclusion (10s)**
   - Résumer les fonctionnalités

---

## 📝 Rapport final - Structure suggérée

1. **Introduction**
   - Contexte du projet
   - Objectifs

2. **Architecture**
   - Schéma global
   - Technologies utilisées

3. **Implémentation API REST**
   - Code JAX-RS
   - Intégration Gemini AI
   - Authentification Jakarta

4. **Implémentation Extension Chrome**
   - Manifest V3
   - Side Panel API
   - Web Speech APIs

5. **Fonctionnalités vocales**
   - Speech-to-Text
   - Text-to-Speech
   - Voice-to-Voice

6. **Tests**
   - Tests API (Postman, cURL, PowerShell)
   - Tests extension
   - Tests vocaux

7. **Captures d'écran**
   - Toutes les captures listées ci-dessus

8. **Difficultés rencontrées**
   - Problèmes d'encodage UTF-8
   - Configuration WildFly
   - Voix TTS arabes

9. **Améliorations futures**
   - Liste des améliorations possibles

10. **Conclusion**

---

**Bonne chance pour votre projet ! 🚀**