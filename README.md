## 📺 Démonstration Vidéo
Regardez la vidéo ici :https://drive.google.com/file/d/1InXKrC1oQUhz3mWwfXdVfqLo3JjnOWPh/view?usp=drive_link

## ✨ Fonctionnalités

### 🎯 Fonctionnalités principales
- ✅ **Traduction texte** : Anglais → Darija via API REST
- ✅ **Authentification sécurisée** : Basic Auth avec credentials
- ✅ **Interface Side Panel** : S'ouvre à côté de la page web

### 🎤 Fonctionnalités vocales
- ✅ **Speech-to-Text** : Reconnaissance vocale en anglais
- ✅ **Text-to-Speech** : Lecture audio de la traduction en arabe
- ✅ **Voice-to-Voice** : Pipeline complet parole → traduction → parole

### 🔧 Fonctionnalités utilitaires
- ✅ **Récupération de texte sélectionné** : Depuis n'importe quelle page web
- ✅ **Copier la traduction** : Dans le presse-papiers
- ✅ **Configuration personnalisée** : API endpoint et credentials
- ✅ **Raccourci clavier** : Ctrl+Enter pour traduire

---

## 📁 Structure des fichiers

```
DarijaTranslatorExtension/
├── manifest.json          # Configuration de l'extension
├── sidepanel.html         # Interface utilisateur
├── sidepanel.css          # Styles
├── sidepanel.js           # Logique de l'application
├── background.js          # Service Worker
├── icons/                 # Icônes de l'extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # Ce fichier
```

---

## 🚀 Installation

### 1️⃣ Prérequis
- Google Chrome (ou navigateur basé sur Chromium)
- Serveur WildFly avec l'API REST en cours d'exécution
- URL API : `http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate`

### 2️⃣ Installer l'extension

1. **Ouvrez Chrome Extensions**
   ```
   chrome://extensions/
   ```

2. **Activez le Mode développeur**
   - Cliquez sur le bouton "Mode développeur" en haut à droite

3. **Chargez l'extension**
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier contenant les fichiers de l'extension

4. **Vérifiez l'installation**
   - L'icône de l'extension devrait apparaître dans la barre d'outils

---

## 🎮 Utilisation

### Méthode 1 : Traduction par texte

1. Cliquez sur l'icône de l'extension
2. Le side panel s'ouvre à droite
3. Tapez ou collez du texte anglais
4. Cliquez sur "🔄 Translate to Darija"
5. La traduction apparaît en caractères arabes

### Méthode 2 : Traduction vocale (Speech-to-Text)

1. Ouvrez le side panel
2. Cliquez sur "🎤 Speak in English"
3. Parlez en anglais (ex: "Hello, how are you?")
4. Le texte est reconnu et traduit automatiquement

### Méthode 3 : Voice-to-Voice (complet)

1. Cliquez sur "🎤 Speak in English"
2. Parlez votre phrase
3. Attendez la traduction
4. Cliquez sur "🔊 Read Aloud"
5. Écoutez la traduction en darija !

### Méthode 4 : Depuis une page web

1. Sélectionnez du texte sur n'importe quelle page
2. Ouvrez le side panel
3. Cliquez sur "📋 Get Selected Text"
4. Traduisez

---

## ⚙️ Configuration

### Modifier les paramètres

1. Dans le side panel, cliquez sur "⚙️ Settings"
2. Modifiez les paramètres :
   - **API Endpoint** : URL de votre API REST
   - **Username** : Nom d'utilisateur (défaut: `translator`)
   - **Password** : Mot de passe (défaut: `password123`)
3. Cliquez sur "💾 Save"

### Paramètres par défaut

```
API Endpoint: http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate
Username: translator
Password: password123
```

---

## 🎤 Fonctionnalités vocales détaillées

### Speech-to-Text (Reconnaissance vocale)

**Comment ça marche :**
- Utilise l'API Web Speech Recognition
- Langue : Anglais américain (en-US)
- Reconnaissance automatique après la parole

**Navigateurs supportés :**
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Opera
- ❌ Firefox (non supporté actuellement)

**Dépannage :**
- Si le bouton est grisé : votre navigateur ne supporte pas la reconnaissance vocale
- Si erreur "not-allowed" : autorisez l'accès au microphone dans les paramètres Chrome
- Si erreur "no-speech" : parlez plus fort ou vérifiez votre microphone

### Text-to-Speech (Synthèse vocale)

**Comment ça marche :**
- Utilise l'API Web Speech Synthesis
- Langue : Arabe (ar-SA)
- Vitesse : 0.85x (légèrement ralentie pour meilleure compréhension)

**Voix disponibles :**
L'extension cherche automatiquement une voix arabe installée sur votre système.

**Améliorer la qualité vocale :**
- Windows : Installer des voix TTS arabes depuis les paramètres
- macOS : Les voix arabes sont généralement pré-installées
- Linux : Installer espeak ou festival avec support arabe

---

## 🧪 Tests

### Test 1 : Traduction basique
```
Input: "Hello, how are you?"
Expected Output: "كيف داير؟ لاباس؟"
```

### Test 2 : Reconnaissance vocale
1. Cliquer sur le microphone
2. Dire : "Good morning"
3. Vérifier que le texte apparaît
4. Vérifier que la traduction se lance automatiquement

### Test 3 : Text-to-Speech
1. Traduire n'importe quel texte
2. Cliquer sur "🔊 Read Aloud"
3. Vérifier que l'audio se joue en arabe

### Test 4 : Pipeline complet (Voice-to-Voice)
1. Microphone → Parler en anglais
2. Reconnaissance → Texte anglais
3. Traduction → Texte darija
4. Read Aloud → Audio darija

---

## 🐛 Dépannage

### Problème : "Authentication failed"
**Solution :**
- Vérifiez que WildFly est en cours d'exécution
- Vérifiez les credentials dans Settings
- Vérifiez que l'utilisateur existe dans WildFly

### Problème : "API endpoint not found"
**Solution :**
- Vérifiez l'URL de l'API dans Settings
- Vérifiez que votre WAR est déployé sur WildFly
- Vérifiez les logs WildFly

### Problème : Le microphone ne fonctionne pas
**Solution :**
- Autorisez l'accès au microphone dans Chrome
- Allez dans : `chrome://settings/content/microphone`
- Assurez-vous que le site n'est pas bloqué

### Problème : Pas de son lors du Read Aloud
**Solution :**
- Vérifiez le volume de votre système
- Installez des voix TTS arabes sur votre OS
- Testez avec une autre langue pour voir si le TTS fonctionne

### Problème : CORS Error
**Solution :**
- L'extension a la permission `<all_urls>`
- Si le problème persiste, vérifiez la configuration CORS de votre serveur

---

## 📊 Technologies utilisées

| Technologie | Usage |
|-------------|-------|
| **Chrome Extension Manifest V3** | Structure de l'extension |
| **Side Panel API** | Interface utilisateur |
| **Web Speech Recognition API** | Speech-to-Text |
| **Web Speech Synthesis API** | Text-to-Speech |
| **Fetch API** | Communication avec REST API |
| **Chrome Storage API** | Sauvegarde des paramètres |
| **Chrome Scripting API** | Récupération de texte sélectionné |

---

## 🔐 Sécurité

- ✅ Authentification Basic Auth
- ✅ Credentials stockés localement via Chrome Storage
- ✅ Communication HTTPS recommandée en production
- ⚠️ En développement : localhost sans HTTPS acceptable

**Note :** Pour la production, remplacez `http://localhost` par `https://votre-domaine.com`

---

## 📝 Changelog

### Version 2.0.0 (Actuelle)
- ✅ Ajout de la reconnaissance vocale (Speech-to-Text)
- ✅ Ajout de la synthèse vocale (Text-to-Speech)
- ✅ Pipeline Voice-to-Voice complet
- ✅ Panneau de configuration des paramètres
- ✅ Amélioration de l'interface utilisateur
- ✅ Meilleure gestion des erreurs
- ✅ Logs console détaillés

### Version 1.0.0
- ✅ Traduction texte basique
- ✅ Récupération de texte sélectionné
- ✅ Authentification Basic Auth
- ✅ Interface Side Panel

---

## 🎓 Pour votre rapport de projet

### Captures d'écran à inclure

1. **Interface principale**
   - Vue du side panel avec tous les éléments

2. **Reconnaissance vocale en action**
   - Bouton microphone actif (bleu)
   - Indicateur "Listening..."

3. **Traduction affichée**
   - Texte arabe affiché
   - Boutons Copy et Read Aloud visibles

4. **Paramètres**
   - Panneau de configuration ouvert
   - Champs API, Username, Password

5. **Tests**
   - Test sans authentification → 401
   - Test avec authentification → 200 OK

### Démonstration vidéo suggérée

1. Ouvrir l'extension
2. Parler en anglais (microphone)
3. Voir la reconnaissance du texte
4. Voir la traduction automatique
5. Cliquer sur Read Aloud
6. Entendre la traduction en darija

---

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs dans la Console Chrome (F12)
2. Vérifiez les logs WildFly
3. Consultez ce README

---

## 🎯 Améliorations futures possibles

- [ ] Support multilingue (autres langues → Darija)
- [ ] Historique des traductions
- [ ] Export des traductions (PDF, TXT)
- [ ] Mode offline avec cache
- [ ] Suggestions de traduction
- [ ] Détection automatique de la langue
- [ ] Support d'autres dialectes arabes
- [ ] Thèmes personnalisables
- [ ] Raccourcis clavier configurables

---

**Développé pour le projet Web Services Course 2024**  
**Version 2.0.0 - Voice-to-Voice Translation**
