// Este script actúa como el puente entre la extensión y la lógica de la guía.

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_GUIDE') {
    // Las variables y funciones (steps, showStep) están definidas en guide-logic.js
    steps = message.payload.pasos || [];
    if (steps.length > 0) {
      showStep(0);
      sendResponse({ status: "Guía iniciada" });
    } else {
      sendResponse({ status: "No hay pasos para mostrar" });
    }
  }
  return true; // Mantener el canal de mensajes abierto para respuestas asíncronas
});
