<?php
$translation = "";
$englishText = "";
$error = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['text'])) {
    $englishText = trim($_POST['text']);
    
    // Vérifier que le texte n'est pas vide
    if (empty($englishText)) {
        $error = "Please enter some text to translate.";
    } else {
        $url = "http://localhost:8080/DarijaTranslatorService-1.0-SNAPSHOT/api/translator/translate";
        
        $data = array("text" => $englishText);
        $options = array(
            'http' => array(
                'header'  => "Content-type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data),
                'ignore_errors' => true
            )
        );
        $context = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);
        
        if ($result !== FALSE) {
            $response = json_decode($result, true);
            $translation = $response['darija'] ?? "";
            if (!$translation) {
                $error = "Translation failed: Invalid response from API";
            }
        } else {
            $error = "Translation failed: Could not connect to API. Make sure your service is running on port 8080.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Darija Translator</title>
  <style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  font-size: 28px;
  margin-bottom: 5px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 14px;
}

/* ========== VOICE SECTION ========== */
.voice-section {
  margin-bottom: 20px;
  text-align: center;
}

.btn-voice {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-voice:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(245, 87, 108, 0.4);
}

.btn-voice.listening {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0.7);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(79, 172, 254, 0);
  }
}

.voice-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  color: #3498db;
  font-weight: bold;
  font-size: 14px;
}

.voice-indicator .pulse {
  width: 10px;
  height: 10px;
  background: #3498db;
  border-radius: 50%;
  margin-right: 8px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.hidden {
  display: none !important;
}

/* ========== INPUT SECTION ========== */
.input-section {
  margin-bottom: 20px;
}

.input-section label {
  display: block;
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
}

#englishText {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
  line-height: 1.5;
}

#englishText:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* ========== BUTTONS ========== */
.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.button-group.three-columns {
  grid-template-columns: 1fr 1fr 1fr;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.btn:active {
  transform: scale(0.95);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 100%;
  font-size: 16px;
  padding: 15px;
  margin-bottom: 20px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #bdc3c7;
}

.btn-copy {
  background: #3498db;
  color: white;
}

.btn-copy:hover {
  background: #2980b9;
}

.btn-speak {
  background: #27ae60;
  color: white;
}

.btn-speak:hover {
  background: #229954;
}

.btn-stop {
  background: #e74c3c;
  color: white;
}

.btn-stop:hover {
  background: #c0392b;
}

/* ========== LOADER ========== */
.loader {
  text-align: center;
  padding: 30px;
}

.loader p {
  color: #7f8c8d;
  margin-top: 10px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ========== RESULT ========== */
.result {
  background: #ecf0f1;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  animation: fadeIn 0.3s ease-out;
}

.result h3 {
  color: #27ae60;
  margin-bottom: 15px;
  font-size: 16px;
}

.darija-text {
  background: white;
  padding: 20px;
  border-radius: 10px;
  font-size: 24px;
  text-align: right;
  direction: rtl;
  color: #27ae60;
  line-height: 1.8;
  min-height: 60px;
  margin-bottom: 15px;
  font-family: 'Arial', 'Tahoma', sans-serif;
  word-wrap: break-word;
}

/* ========== ERROR ========== */
.error {
  background: #e74c3c;
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  animation: fadeIn 0.3s ease-out;
}

.error h3 {
  margin-bottom: 10px;
  font-size: 16px;
}

.error p {
  margin: 0;
  font-size: 14px;
}

/* ========== FOOTER ========== */
.footer {
  margin-top: 20px;
  padding-top: 15px;
  text-align: center;
  border-top: 1px solid #ecf0f1;
}

.footer p {
  color: #7f8c8d;
  font-size: 12px;
  margin: 5px 0;
}

.footer .version {
  color: #bdc3c7;
  font-size: 11px;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🇲🇦 Darija Translator</h1>
      <p class="subtitle">English → Moroccan Arabic</p>
    </div>

    <!-- Voice Section -->
    <div class="voice-section">
      <button type="button" class="btn-voice" id="voiceBtn" onclick="toggleVoice()">
        🎤 <span id="voiceStatus">Speak in English</span>
      </button>
      <div id="voiceIndicator" class="voice-indicator hidden">
        <div class="pulse"></div>
        <span>Listening...</span>
      </div>
    </div>

    <!-- Input Section -->
    <form method="post" id="translateForm">
      <div class="input-section">
        <label for="englishText">English Text:</label>
        <textarea name="text" id="englishText" rows="6" placeholder="Type, paste, or speak English text here..."><?php echo htmlspecialchars($englishText); ?></textarea>
        
        <div class="button-group">
          <button type="button" class="btn btn-secondary" onclick="pasteText()">
            📋 Paste
          </button>
          <button type="button" class="btn btn-secondary" onclick="clearText()">
            🗑️ Clear
          </button>
        </div>
      </div>

      <!-- Translate Button -->
      <button type="submit" class="btn btn-primary">
        🔄 Translate to Darija
      </button>
    </form>

    <!-- Result -->
    <?php if ($translation): ?>
    <div class="result">
      <h3>✅ Translation Complete</h3>
      <div class="darija-text" id="darijaText"><?php echo htmlspecialchars($translation); ?></div>
      
      <div class="button-group three-columns">
        <button type="button" class="btn btn-copy" onclick="copyTranslation()">
          📋 Copy
        </button>
        <button type="button" class="btn btn-speak" id="speakBtn" onclick="speakTranslation()">
          🔊 Read Aloud
        </button>
        <button type="button" class="btn btn-stop hidden" id="stopBtn" onclick="stopSpeaking()">
          ⏹️ Stop
        </button>
      </div>
    </div>
    <?php endif; ?>

    <!-- Error -->
    <?php if ($error): ?>
    <div class="error">
      <h3>❌ Error</h3>
      <p><?php echo htmlspecialchars($error); ?></p>
    </div>
    <?php endif; ?>

    <div class="footer">
      <p>💡 Click the microphone to speak, or type your text</p>
      <p class="version">v2.0 - Voice-to-Voice Translation</p>
    </div>
  </div>

  <script>
// ========== VARIABLES ==========
let recognition = null;
let isListening = false;

// ========== VOICE RECOGNITION ==========
function initSpeechRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      isListening = true;
      document.getElementById('voiceBtn').classList.add('listening');
      document.getElementById('voiceStatus').textContent = 'Listening...';
      document.getElementById('voiceIndicator').classList.remove('hidden');
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('englishText').value = transcript;
      stopListening();
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      alert('Voice recognition error: ' + event.error);
      stopListening();
    };
    
    recognition.onend = () => {
      stopListening();
    };
  } else {
    document.getElementById('voiceBtn').disabled = true;
    document.getElementById('voiceStatus').textContent = 'Voice not supported';
  }
}

function toggleVoice() {
  if (!recognition) {
    alert('Speech recognition is not supported in your browser');
    return;
  }
  
  if (isListening) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
      alert('Could not start voice recognition. Please try again.');
    }
  }
}

function stopListening() {
  isListening = false;
  document.getElementById('voiceBtn').classList.remove('listening');
  document.getElementById('voiceStatus').textContent = 'Speak in English';
  document.getElementById('voiceIndicator').classList.add('hidden');
}

// ========== TEXT-TO-SPEECH ==========
function speakTranslation() {
  const text = document.getElementById('darijaText').textContent;
  
  if (!text) {
    alert('No translation to read');
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  utterance.onstart = () => {
    document.getElementById('speakBtn').classList.add('hidden');
    document.getElementById('stopBtn').classList.remove('hidden');
  };
  
  utterance.onend = () => {
    document.getElementById('speakBtn').classList.remove('hidden');
    document.getElementById('stopBtn').classList.add('hidden');
  };
  
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  window.speechSynthesis.cancel();
  document.getElementById('speakBtn').classList.remove('hidden');
  document.getElementById('stopBtn').classList.add('hidden');
}

// ========== OTHER FUNCTIONS ==========
async function pasteText() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById('englishText').value = text;
  } catch (err) {
    alert('Could not paste text. Use Ctrl+V instead.');
  }
}

function clearText() {
  document.getElementById('englishText').value = '';
  document.getElementById('englishText').focus();
}

function copyTranslation() {
  const text = document.getElementById('darijaText').textContent;
  
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';
    btn.style.background = '#27ae60';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);
  }).catch(err => {
    alert('Could not copy text');
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initSpeechRecognition();
  console.log('🇲🇦 Darija Translator v2.0 - Ready!');
});
  </script>
</body>
</html>