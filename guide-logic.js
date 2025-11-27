var steps = [];
var currentIndex = -1;
var activeTooltip = null;

function endCurrentGuide() {
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
  document.querySelectorAll('.guided-assistant-highlight').forEach(el => {
    el.classList.remove('guided-assistant-highlight');
  });
  currentIndex = -1;
}

function showStep(index) {
  endCurrentGuide();

  if (index < 0 || index >= steps.length) {
    return;
  }

  currentIndex = index;
  const step = steps[currentIndex];
  const targetElement = document.querySelector(step.elemento);

  if (!targetElement) {
    console.warn(`Asistente Guiado: No se encontró el elemento "${step.elemento}".`);
    return;
  }

  targetElement.classList.add('guided-assistant-highlight');
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const tooltip = document.createElement('div');
  tooltip.className = 'guided-assistant-tooltip';
  tooltip.innerHTML = `
    <div class="guided-assistant-tip">${step.tip}</div>
    <div class="guided-assistant-nav"></div>
  `;

  const navContainer = tooltip.querySelector('.guided-assistant-nav');

  if (currentIndex > 0) {
    const prevButton = document.createElement('button');
    prevButton.innerText = 'Anterior';
    prevButton.onclick = () => showStep(currentIndex - 1);
    navContainer.appendChild(prevButton);
  }

  // Lógica de botones de navegación
  if (currentIndex < steps.length - 1) { // Si no es el último paso
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Siguiente';
    nextButton.onclick = () => showStep(currentIndex + 1);
    navContainer.appendChild(nextButton);
  } else { // Si es el último paso
    // No se añade el botón "Finalizar" para cumplir el requisito de solo mostrar "Anterior"
  }

  document.body.appendChild(tooltip);
  activeTooltip = tooltip;

  const targetRect = targetElement.getBoundingClientRect();
  tooltip.style.position = 'absolute';
  tooltip.style.top = `${window.scrollY + targetRect.top}px`;
  tooltip.style.left = `${window.scrollX + targetRect.right + 10}px`;
}
