document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-guide');
  const jsonDataTextarea = document.getElementById('json-data');

  const exampleJson = {
    "proceso": "Apertura del sistema",
    "version": "1.0",
    "Descripción": "Ejemplo de guía.",
    "pasos": [
      { "id": 1, "paso": "Ingresar usuario", "elemento": "#usuario", "tip": "Ingresa aqui tu usuario." },
      { "id": 2, "paso": "Ingresar clave", "elemento": "#password", "tip": "Escribe aqui tu clave." },
      { "id": 3, "paso": "Ingresar", "elemento": "#btn-ingresar", "tip": "Presiona clic en el botón ingresar." }
    ]
  };
  jsonDataTextarea.value = JSON.stringify(exampleJson, null, 2);

  startButton.addEventListener('click', async () => {
    const jsonString = jsonDataTextarea.value;
    let guideData;

    try {
      guideData = JSON.parse(jsonString);
    } catch (error) {
      alert('El formato del JSON no es válido.');
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['style.css'],
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['guide-logic.js', 'content.js'],
    });

    chrome.tabs.sendMessage(tab.id, {
      type: 'START_GUIDE',
      payload: guideData,
    });

    window.close();
  });
});
