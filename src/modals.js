import { state } from './state.js';
import { showToast, triggerFilterAction, updateStatsUI } from './ui.js';
import { updateStatsDashboard, exportProgress, importProgress } from './stats.js';
import { clearAllFilters } from './ui.js';

export function openDialogModal(modal) {
  if (!modal) return;
  modal.classList.remove('opacity-0');
  modal.style.display = 'flex';
  modal.showModal();
}

export function closeDialogModal(modal) {
  if (!modal) return;
  modal.classList.add('opacity-0');
  modal.close();
  modal.style.display = '';
}

export function initModals() {
  // Theme initialization (Light Theme is default)
  const savedTheme = localStorage.getItem('java_trainer_theme');
  const isDarkMode = savedTheme === 'dark';

  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  const darkHljs = document.getElementById('hljs-dark-theme');
  const lightHljs = document.getElementById('hljs-light-theme');
  if (darkHljs && lightHljs) {
    darkHljs.disabled = !isDarkMode;
    lightHljs.disabled = isDarkMode;
  }

  // Theme toggle triggers
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('java_trainer_theme', isDark ? 'dark' : 'light');

      // Toggle Highlight styles
      const dHljs = document.getElementById('hljs-dark-theme');
      const lHljs = document.getElementById('hljs-light-theme');
      if (dHljs) dHljs.disabled = !isDark;
      if (lHljs) lHljs.disabled = isDark;
      showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled', 'info');
    });
  }

  // Stats Modal
  const statsBtn = document.getElementById('my-stats-btn');
  const statsModal = document.getElementById('stats-dashboard-modal');
  const closeStatsBtn = document.getElementById('close-stats-modal');

  if (statsBtn && statsModal) {
    statsBtn.addEventListener('click', () => {
      if (typeof updateStatsDashboard === 'function') {
        updateStatsDashboard();
      }
      openDialogModal(statsModal);
    });
  }
  if (closeStatsBtn && statsModal) {
    closeStatsBtn.addEventListener('click', () => closeDialogModal(statsModal));
  }

  // Keyboard Shortcuts Modal
  const shortcutsBtn = document.getElementById('shortcuts-btn');
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const closeShortcutsBtn = document.getElementById('close-shortcuts-modal');
  if (shortcutsBtn && shortcutsModal) {
    shortcutsBtn.addEventListener('click', () => openDialogModal(shortcutsModal));
  }
  if (closeShortcutsBtn && shortcutsModal) {
    closeShortcutsBtn.addEventListener('click', () => closeDialogModal(shortcutsModal));
  }

  // Backup & Custom Questions Modal
  const backupBtn = document.getElementById('btn-backup-modal');
  const backupModal = document.getElementById('backup-modal');
  const closeBackupBtn = document.getElementById('close-backup-modal-btn');
  const closeBackupFooter = document.getElementById('btn-close-backup-footer');
  const exportBtn = document.getElementById('btn-export-backup');
  const importBtn = document.getElementById('btn-import-backup');
  const fileInput = document.getElementById('backup-file-input');
  const customQuestionsInput = document.getElementById('custom-questions-input');
  const importCustomBtn = document.getElementById('btn-import-custom-questions');

  if (backupBtn && backupModal) {
    backupBtn.addEventListener('click', () => openDialogModal(backupModal));
  }
  if (closeBackupBtn && backupModal) {
    closeBackupBtn.addEventListener('click', () => closeDialogModal(backupModal));
  }
  if (closeBackupFooter && backupModal) {
    closeBackupFooter.addEventListener('click', () => closeDialogModal(backupModal));
  }
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportProgress();
      showToast('Резервная копия скачана!', 'success');
    });
  }
  if (importBtn && fileInput) {
    importBtn.addEventListener('click', () => {
      const file = fileInput.files[0];
      if (!file) {
        showToast('Выберите .json файл бэкапа', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = importProgress(e.target.result);
        if (res.success) {
          triggerFilterAction();
          updateStatsUI();
          showToast('Прогресс успешно восстановлен!', 'success');
          closeDialogModal(backupModal);
        } else {
          showToast('Ошибка импорта: ' + res.error, 'error');
        }
      };
      reader.readAsText(file);
    });
  }
  if (importCustomBtn && customQuestionsInput) {
    importCustomBtn.addEventListener('click', () => {
      const raw = customQuestionsInput.value.trim();
      if (!raw) {
        showToast('Вставьте JSON с вопросами', 'error');
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const existing = JSON.parse(localStorage.getItem('java_trainer_custom_questions') || '[]');
        let count = 0;
        list.forEach((q) => {
          if (!q.id) q.id = 'custom-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
          if (!q.tags) q.tags = ['custom'];
          if (!q.tags.includes('custom')) q.tags.push('custom');
          if (!existing.some((x) => x.id === q.id)) {
            existing.push(q);
            count++;
          }
          if (!state.questionsList.some((x) => x.id === q.id)) {
            state.questionsList.push(q);
          }
        });
        localStorage.setItem('java_trainer_custom_questions', JSON.stringify(existing));
        triggerFilterAction();
        updateStatsUI();
        showToast(`Добавлено ${count} вопросов в базу!`, 'success');
        customQuestionsInput.value = '';
        closeDialogModal(backupModal);
      } catch (err) {
        showToast('Неверный формат JSON', 'error');
      }
    });
  }

  // Copy source code to clipboard
  const copyCodeBtn = document.getElementById('copy-code-btn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const codeContentEl = document.getElementById('code-content');
      const codeText = codeContentEl ? codeContentEl.textContent : '';
      if (!codeText) return;

      const textarea = document.createElement('textarea');
      textarea.value = codeText;
      document.body.appendChild(textarea);
      textarea.select();
      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          showToast('Code copied to clipboard!', 'success');
        })
        .catch(() => {
          showToast('Failed to copy code', 'info');
        });
      document.body.removeChild(textarea);
    });
  }

  // Direct Share Link Button
  const shareLinkBtn = document.getElementById('share-link-btn');
  if (shareLinkBtn) {
    shareLinkBtn.addEventListener('click', () => {
      if (state.filteredQuestions.length === 0) return;
      const q = state.filteredQuestions[state.currentIndex];
      if (!q) return;
      const url = `${window.location.origin}${window.location.pathname}#q=${q.id}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(url)
          .then(() => {
            showToast('Direct question link copied!', 'bookmark');
          })
          .catch(() => {
            showToast(`Link: ${url}`, 'bookmark');
          });
      } else {
        showToast(`Link: ${url}`, 'bookmark');
      }
    });
  }

  // Reset Progress logic
  const resetProgBtn = document.getElementById('reset-progress-btn');
  if (resetProgBtn) {
    resetProgBtn.addEventListener('click', () => {
      if (
        confirm(
          'Are you sure you want to reset all progress (XP, ranks, question ratings, and bookmarks)? This cannot be undone.'
        )
      ) {
        localStorage.removeItem('java_trainer_mastered');
        localStorage.removeItem('java_trainer_flagged');
        localStorage.removeItem('java_trainer_sr');
        window.location.reload();
      }
    });
  }
}
