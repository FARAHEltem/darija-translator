// background.js - Service Worker pour l'extension Darija Translator

console.log('🚀 Darija Translator Background Service Worker starting...');

// Configuration du side panel
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .then(() => {
    console.log('✅ Side panel behavior configured');
  })
  .catch((error) => {
    console.error('❌ Error configuring side panel:', error);
  });

// Listener pour l'installation de l'extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('🎉 Extension installed for the first time');
    
    // Ouvrir le side panel automatiquement lors de la première installation
    chrome.tabs.create({ url: 'chrome://extensions/' });
  } else if (details.reason === 'update') {
    console.log('🔄 Extension updated to version', chrome.runtime.getManifest().version);
  }
});

// Listener pour les messages depuis le side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Message received:', request);
  
  if (request.action === 'translate') {
    console.log('🔄 Translation request:', request.text);
    // Vous pouvez ajouter de la logique supplémentaire ici si nécessaire
    sendResponse({ status: 'received' });
  }
  
  return true; // Permet les réponses asynchrones
});

// Log de démarrage
console.log('✅ Darija Translator Background Service Worker ready');