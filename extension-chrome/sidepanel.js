// sidepanel.js - Version complète avec Speech-to-Speech et Text-to-Speech

// ========== CONFIGURATION ==========
let API_URL = 'http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate';
let USERNAME = 'translator';
let PASSWORD = 'password123';

// ========== ÉLÉMENTS DOM ==========
const englishText = document.getElementById('englishText');
const translateBtn = document.getElementById('translateBtn');
const voiceInputBtn = document.getElementById('voiceInputBtn');
const voiceStatus = document.getElementById('voiceStatus');
const voiceIndicator = document.getElementById('voiceIndicator');
const getSelectionBtn = document.getElementById('getSelectionBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const speakBtn = document.getElementById('speakBtn');
const stopSpeakBtn = document.getElementById('stopSpeakBtn');
const loader = document.getElementById('loader');
const result = document.getElementById('result');
const darijaText = document.getElementById('darijaText');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const apiUrlInput = document.getElementById('apiUrl');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// ========== VARIABLES GLOBALES ==========
let recognition = null;
let isListening = false;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

// ========== INITIALISATION ==========
init();

function init() {
  console.log('🚀 Darija Translator Extension initializing...');
  
  // Charger les paramètres sauvegardés
  loadSettings();
  
  // Initialiser la reconnaissance vocale
  initSpeechRecognition();
  
  // Charger les voix disponibles
  loadVoices();
  
  // Event listeners
  translateBtn.addEventListener('click', handleTranslate);
  voiceInputBtn.addEventListener('click', toggleVoiceInput);
  getSelectionBtn.addEventListener('click', getSelectedText);
  clearBtn.addEventListener('click', clearAll);
  copyBtn.addEventListener('click', copyTranslation);
  speakBtn.addEventListener('click', speakTranslation);
  stopSpeakBtn.addEventListener('click', stopSpeaking);
  settingsBtn.addEventListener('click', toggleSettings);
  saveSettingsBtn.addEventListener('click', saveSettings);
  closeSettingsBtn.addEventListener('click', () => settingsPanel.classList.add('hidden'));
  
  // Permettre Ctrl+Enter pour traduire
  englishText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleTranslate();
    }
  });
  
  console.log('✅ Extension initialized successfully');
}

// ========== RECONNAISSANCE VOCALE (SPEECH-TO-TEXT) ==========

function initSpeechRecognition() {
  console.log('🎤 Initializing speech recognition...');
  
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configuration
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    // Event: Début de l'écoute
    recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      isListening = true;
      voiceInputBtn.classList.add('listening');
      voiceStatus.textContent = 'Listening...';
      voiceIndicator.classList.remove('hidden');
      hideError();
    };
    
    // Event: Résultat obtenu
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      console.log(`✅ Recognized: "${transcript}" (confidence: ${confidence})`);
      
      englishText.value = transcript;
      hideError();
      
      // Auto-translate après reconnaissance vocale
      setTimeout(() => {
        handleTranslate();
      }, 500);
    };
    
    // Event: Erreur
    recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
      
      let errorMsg = 'Voice recognition error';
      switch (event.error) {
        case 'no-speech':
          errorMsg = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMsg = 'Microphone not accessible. Check permissions.';
          break;
        case 'not-allowed':
          errorMsg = 'Microphone permission denied.';
          break;
        case 'network':
          errorMsg = 'Network error. Check your connection.';
          break;
        default:
          errorMsg = `Voice recognition error: ${event.error}`;
      }
      
      showError(errorMsg);
      stopListening();
    };
    
    // Event: Fin de l'écoute
    recognition.onend = () => {
      console.log('🎤 Speech recognition ended');
      stopListening();
    };
    
    console.log('✅ Speech recognition initialized');
  } else {
    console.warn('⚠️ Speech recognition not supported in this browser');
    voiceInputBtn.disabled = true;
    voiceStatus.textContent = 'Voice not supported';
  }
}

function toggleVoiceInput() {
  if (!recognition) {
    showError('Speech recognition is not supported in your browser');
    return;
  }
  
  if (isListening) {
    console.log('🛑 Stopping speech recognition');
    recognition.stop();
  } else {
    console.log('▶️ Starting speech recognition');
    
    // Demander d'abord l'accès au microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // Libérer le flux immédiatement
        stream.getTracks().forEach(track => track.stop());
        
        // Maintenant démarrer la reconnaissance vocale
        try {
          recognition.start();
        } catch (e) {
          console.error('❌ Error starting recognition:', e);
          if (e.name === 'InvalidStateError') {
            // La reconnaissance est déjà en cours
            console.log('Recognition already started');
          } else {
            showError('Could not start voice recognition. Please try again.');
          }
        }
      })
      .catch((error) => {
        console.error('❌ Microphone permission error:', error);
        
        let errorMsg = 'Microphone access denied.';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMsg = 'Microphone permission denied. Please allow microphone access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMsg = 'No microphone found. Please connect a microphone.';
        } else {
          errorMsg = `Microphone error: ${error.message}`;
        }
        
        showError(errorMsg);
      });
  }
}

function stopListening() {
  isListening = false;
  voiceInputBtn.classList.remove('listening');
  voiceStatus.textContent = 'Speak in English';
  voiceIndicator.classList.add('hidden');
}

// ========== SYNTHÈSE VOCALE (TEXT-TO-SPEECH) ==========

function loadVoices() {
  // Les voix peuvent prendre du temps à charger
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      const voices = speechSynthesis.getVoices();
      console.log(`🔊 ${voices.length} voices loaded`);
      
      // Log des voix arabes disponibles
      const arabicVoices = voices.filter(voice => voice.lang.startsWith('ar'));
      console.log('🇸🇦 Arabic voices:', arabicVoices.map(v => `${v.name} (${v.lang})`));
    };
  }
}

function speakTranslation() {
  const textToSpeak = darijaText.textContent;
  
  if (!textToSpeak) {
    showError('No translation to read');
    return;
  }
  
  console.log('🔊 Speaking translation:', textToSpeak);
  
  // Arrêter toute lecture en cours
  stopSpeaking();
  
  // Créer une nouvelle instance d'utterance
  currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
  
  // Configuration pour l'arabe
  currentUtterance.lang = 'ar-SA'; // Arabe (Arabie Saoudite)
  currentUtterance.rate = 0.85; // Vitesse légèrement réduite
  currentUtterance.pitch = 1.0;
  currentUtterance.volume = 1.0;
  
  // Essayer de trouver une voix arabe
  const voices = speechSynthesis.getVoices();
  const arabicVoice = voices.find(voice => 
    voice.lang.startsWith('ar') || 
    voice.lang.includes('Arabic')
  );
  
  if (arabicVoice) {
    currentUtterance.voice = arabicVoice;
    console.log('✅ Using Arabic voice:', arabicVoice.name);
  } else {
    console.warn('⚠️ No Arabic voice found, using default');
  }
  
  // Event listeners
  currentUtterance.onstart = () => {
    console.log('▶️ Speech started');
    speakBtn.classList.add('hidden');
    stopSpeakBtn.classList.remove('hidden');
  };
  
  currentUtterance.onend = () => {
    console.log('✅ Speech ended');
    speakBtn.classList.remove('hidden');
    stopSpeakBtn.classList.add('hidden');
  };
  
  currentUtterance.onerror = (event) => {
    console.error('❌ Speech synthesis error:', event);
    showError(`Error reading text aloud: ${event.error}`);
    speakBtn.classList.remove('hidden');
    stopSpeakBtn.classList.add('hidden');
  };
  
  // Lancer la lecture
  speechSynthesis.speak(currentUtterance);
}

function stopSpeaking() {
  if (speechSynthesis.speaking) {
    console.log('🛑 Stopping speech');
    speechSynthesis.cancel();
  }
  speakBtn.classList.remove('hidden');
  stopSpeakBtn.classList.add('hidden');
}

// ========== TRADUCTION ==========

async function handleTranslate() {
  const text = englishText.value.trim();
  
  if (!text) {
    showError('Please enter some text to translate');
    return;
  }
  
  console.log('🔄 Translating:', text);
  
  hideError();
  showLoader();
  hideResult();
  stopSpeaking();
  
  try {
    const translation = await translateText(text);
    console.log('✅ Translation received:', translation);
    displayTranslation(translation);
  } catch (err) {
    console.error('❌ Translation error:', err);
    showError(err.message);
  } finally {
    hideLoader();
  }
}

async function translateText(text) {
  const credentials = btoa(`${USERNAME}:${PASSWORD}`);
  
  console.log('📡 Calling API:', API_URL);
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`
    },
    body: JSON.stringify({ text: text })
  });
  
  console.log('📡 API Response status:', response.status);
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Check your credentials in settings.');
    }
    if (response.status === 404) {
      throw new Error('API endpoint not found. Check your API URL in settings.');
    }
    if (response.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('📡 API Response data:', data);
  
  if (!data.darija) {
    throw new Error('Invalid response from API');
  }
  
  return data.darija;
}

function displayTranslation(translation) {
  darijaText.textContent = translation;
  result.classList.remove('hidden');
  
  // Arrêter toute lecture en cours
  stopSpeaking();
  
  // Scroll vers le résultat
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========== AUTRES FONCTIONS ==========

async function getSelectedText() {
  console.log('📋 Getting selected text from page...');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('No active tab found');
    }
    
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => window.getSelection().toString()
    });
    
    const selectedText = result[0].result;
    
    if (selectedText && selectedText.trim()) {
      console.log('✅ Selected text:', selectedText);
      englishText.value = selectedText;
      hideError();
      englishText.focus();
    } else {
      showError('No text selected on the page. Please select some text first.');
    }
  } catch (err) {
    console.error('❌ Error getting selection:', err);
    showError('Could not get selected text. Make sure you have text selected on the page.');
  }
}

function clearAll() {
  console.log('🗑️ Clearing all');
  englishText.value = '';
  hideResult();
  hideError();
  stopSpeaking();
  englishText.focus();
}

function copyTranslation() {
  const text = darijaText.textContent;
  
  console.log('📋 Copying translation:', text);
  
  navigator.clipboard.writeText(text).then(() => {
    console.log('✅ Text copied to clipboard');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copied!';
    copyBtn.style.background = '#27ae60';
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('❌ Error copying text:', err);
    showError('Could not copy text to clipboard');
  });
}

// ========== PARAMÈTRES ==========

function toggleSettings() {
  settingsPanel.classList.toggle('hidden');
  
  if (!settingsPanel.classList.contains('hidden')) {
    console.log('⚙️ Settings opened');
  }
}

function loadSettings() {
  console.log('⚙️ Loading settings...');
  
  chrome.storage.sync.get(['apiUrl', 'username', 'password'], (data) => {
    if (data.apiUrl) {
      API_URL = data.apiUrl;
      apiUrlInput.value = data.apiUrl;
      console.log('✅ Loaded API URL:', API_URL);
    }
    if (data.username) {
      USERNAME = data.username;
      usernameInput.value = data.username;
      console.log('✅ Loaded username:', USERNAME);
    }
    if (data.password) {
      PASSWORD = data.password;
      passwordInput.value = data.password;
      console.log('✅ Loaded password: ***');
    }
  });
}

function saveSettings() {
  API_URL = apiUrlInput.value.trim();
  USERNAME = usernameInput.value.trim();
  PASSWORD = passwordInput.value;
  
  if (!API_URL || !USERNAME || !PASSWORD) {
    showError('All settings fields are required');
    return;
  }
  
  console.log('💾 Saving settings...');
  
  chrome.storage.sync.set({
    apiUrl: API_URL,
    username: USERNAME,
    password: PASSWORD
  }, () => {
    console.log('✅ Settings saved');
    
    const originalText = saveSettingsBtn.textContent;
    saveSettingsBtn.textContent = '✅ Saved!';
    saveSettingsBtn.style.background = '#27ae60';
    
    setTimeout(() => {
      saveSettingsBtn.textContent = originalText;
      saveSettingsBtn.style.background = '';
      settingsPanel.classList.add('hidden');
    }, 1500);
  });
}

// ========== UI HELPERS ==========

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

function showError(message) {
  console.error('❌', message);
  errorMessage.textContent = message;
  error.classList.remove('hidden');
  
  // Auto-hide après 5 secondes
  setTimeout(() => {
    hideError();
  }, 5000);
}

function hideError() {
  error.classList.add('hidden');
}

function hideResult() {
  result.classList.add('hidden');
}

// ========== LOG DE DÉMARRAGE ==========
console.log('🇲🇦 Darija Translator v2.0 - Ready!');
console.log('📝 Features: Speech-to-Text, Text-to-Speech, Voice-to-Voice Translation');