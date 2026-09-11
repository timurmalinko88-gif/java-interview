import { state } from './state.js';
import { closeDialogModal, openDialogModal } from './modals.js';

export function initHotkeys() {
  const searchInput = document.getElementById('search-input');
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnAnswer = document.getElementById('btn-answer');
  const masteredBtn = document.getElementById('mastered-btn');
  const flagBtn = document.getElementById('flag-btn');
  const srHardBtn = document.getElementById('sr-hard-btn');
  const srMediumBtn = document.getElementById('sr-medium-btn');
  const srEasyBtn = document.getElementById('sr-easy-btn');

  document.addEventListener('keydown', async (e) => {
    // Escape closes open dialog modals
    if (e.key === 'Escape') {
      const openDialog = Array.from(document.querySelectorAll('dialog')).find((d) => d.open);
      if (openDialog) {
        closeDialogModal(openDialog);
        return;
      }
    }

    // Do not trigger hotkeys if user is typing in input or textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Skip hotkeys if any dialog modal is currently open
    const isAnyModalOpen = Array.from(document.querySelectorAll('dialog')).some((d) => d.open);
    if (isAnyModalOpen) {
      return;
    }

    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault();
      if (shortcutsModal) openDialogModal(shortcutsModal);
      return;
    }

    if (e.key === '/') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (btnNext && !btnNext.disabled) btnNext.click();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (btnPrev && !btnPrev.disabled) btnPrev.click();
        break;
      case ' ':
        // Spacebar toggles answer
        e.preventDefault();
        if (btnAnswer) btnAnswer.click();
        break;
      case 'm':
      case 'M':
      case 'ь': // Russian layout 'M'
      case 'Ь':
        e.preventDefault();
        if (masteredBtn) masteredBtn.click();
        break;
      case 'f':
      case 'F':
      case 'а': // Russian layout 'F'
      case 'А':
        e.preventDefault();
        if (flagBtn) flagBtn.click();
        break;
      case '1':
        if (state.isAnswerVisible && !state.isMockMode && srHardBtn) {
          e.preventDefault();
          srHardBtn.click();
        }
        break;
      case '2':
        if (state.isAnswerVisible && !state.isMockMode && srMediumBtn) {
          e.preventDefault();
          srMediumBtn.click();
        }
        break;
      case '3':
        if (state.isAnswerVisible && !state.isMockMode && srEasyBtn) {
          e.preventDefault();
          srEasyBtn.click();
        }
        break;
    }
  });
}
