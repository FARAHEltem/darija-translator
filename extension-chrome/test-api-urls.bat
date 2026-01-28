@echo off
echo ============================================
echo   Test Automatique de l'API Darija
echo ============================================
echo.

set API_PATHS=translator-service-1.0 translator-service DarijaTranslator translator DarijaTranslator-1.0-SNAPSHOT translator-service-1.0-SNAPSHOT

echo Test des URLs possibles...
echo.

for %%P in (%API_PATHS%) do (
    echo [TEST] http://localhost:8080/%%P/api/translator/translate
    curl -X POST http://localhost:8080/%%P/api/translator/translate ^
      -H "Content-Type: application/json" ^
      -d "{\"text\":\"Hello\"}" ^
      -w "\nStatus Code: %%{http_code}\n" ^
      -s -o test_response.txt 2>nul
    
    if errorlevel 1 (
        echo    ^> Erreur de connexion
    ) else (
        echo    ^> Reponse recue, verification...
        type test_response.txt
    )
    echo.
    echo -------------------------------------------
    echo.
)

del test_response.txt 2>nul

echo.
echo ============================================
echo Test termine !
echo.
echo Cherchez la reponse avec "status":"success"
echo pour trouver la bonne URL.
echo ============================================
pause