let steps = [];
let currentIndex = -1;
let activeTooltip = null;

function showStep(index) {
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }

  document.querySelectorAll('.guided-assistant-highlight').forEach(el => {
    el.classList.remove('guided-assistant-highlight');
  });

  if (index < 0 || index >= steps.length) {
    currentIndex = -1;
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

  if (currentIndex < steps.length - 1) {
    const nextButton = document.createElement('button');
    nextButton.innerText = 'Siguiente';
    nextButton.onclick = () => showStep(currentIndex + 1);
    navContainer.appendChild(nextButton);
  }

  document.body.appendChild(tooltip);
  activeTooltip = tooltip;

  const targetRect = targetElement.getBoundingClientRect();
  tooltip.style.position = 'absolute';
  tooltip.style.top = `${window.scrollY + targetRect.top}px`;
  tooltip.style.left = `${window.scrollX + targetRect.right + 10}px`;
}
