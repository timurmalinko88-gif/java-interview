export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function setDifficultyChipInactive(el, diff) {
    el.classList.remove('bg-pine-500', 'bg-roast-500', 'bg-plum-500', 'text-white', 'border-pine-500', 'border-roast-500', 'border-plum-500');
    el.classList.add('bg-transparent', 'text-slate-700', 'dark:text-slate-300');
}

export function setDifficultyChipActive(el, diff) {
    el.classList.remove('bg-transparent', 'text-slate-700', 'dark:text-slate-300');
    if (diff === 'Junior') el.classList.add('bg-pine-500', 'text-white', 'border-pine-500');
    if (diff === 'Middle') el.classList.add('bg-roast-500', 'text-white', 'border-roast-500');
    if (diff === 'Senior') el.classList.add('bg-plum-500', 'text-white', 'border-plum-500');
}

let audioCtx = null;
export function playSound(type) {
  try {
    const isMuted = localStorage.getItem('java_trainer_mute') === 'true';
    if (isMuted) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'flip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'master' || type === 'mastered') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch {
    // Ignore audio context initialization failures
  }
}

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeHtml(dirtyHtml) {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';
  if (typeof DOMParser === 'undefined') return dirtyHtml;

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHtml, 'text/html');
  const blockedTags = ['script', 'iframe', 'object', 'embed', 'form', 'meta', 'base', 'link', 'style'];
  blockedTags.forEach((tag) => {
    doc.body.querySelectorAll(tag).forEach((el) => el.remove());
  });

  const allElements = doc.body.querySelectorAll('*');
  allElements.forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim().toLowerCase();
      if (name.startsWith('on') || name === 'srcdoc') {
        el.removeAttribute(attr.name);
      } else if (
        (name === 'href' || name === 'src' || name === 'xlink:href' || name === 'action') &&
        (val.startsWith('javascript:') || val.startsWith('vbscript:') || val.startsWith('data:text/html'))
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}

export function renderMarkdownSafe(markdownText) {
  if (!markdownText) return '';
  const rawHtml = typeof marked !== 'undefined' ? marked.parse(String(markdownText)) : escapeHtml(markdownText);
  return sanitizeHtml(rawHtml);
}

