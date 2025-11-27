document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-guide');
  const jsonDataTextarea = document.getElementById('json-data');

  // Pre-llenar con el JSON de ejemplo para facilitar las pruebas
  const exampleJson = {
    "proceso": "Apertura del sistema",
    "version": "1.0",
    "Descripción": "Posee los pasos para ingresar al sistema, se asume que este proceso funcionará siempre y cuando el usuario YA se encuentra en la ventana principal del sistema, tomando en cuenta que es un sistema WEB",
    "pasos": [
      { "id": 1, "paso": "Ingresar usuario", "elemento": "#usuario", "tip": "Ingresa aqui tu usuario." },
      { "id": 2, "paso": "Ingresar clave", "elemento": "#password", "tip": "Escribe aqui tu clave, toma en cuenta que si la olvidaste debes recuperarla." },
      { "id": 3, "paso": "Ingresar", "elemento": "#btn-ingresar", "tip": "Presiona clic en el botón ingresar." }
    ]
  };
  jsonDataTextarea.value = JSON.stringify(exampleJson, null, 2);

  startButton.addEventListener('click', async () => {
    const jsonString = jsonDataTextarea.value;
    let guideData;

    if (!jsonString.trim()) {
      alert('Por favor, pega el JSON del proceso en el área de texto.');
      return;
    }

    try {
      guideData = JSON.parse(jsonString);
    } catch (error) {
      alert('El formato del JSON no es válido. Por favor, revísalo.');
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Inyectar primero la lógica y luego el script de contenido
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['guide-logic.js', 'content.js'],
    });

    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['style.css'],
    });

    // Enviar los datos al script de contenido para iniciar la guía
    chrome.tabs.sendMessage(tab.id, {
      type: 'START_GUIDE',
      payload: guideData,
    });

    window.close(); // Cerrar el popup después de iniciar
  });
});
