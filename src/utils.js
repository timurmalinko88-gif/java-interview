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
    el.classList.remove('bg-pine-500', 'bg-roast-500', 'bg-plum-500', 'text-white', 'text-[#2B1904]', 'border-pine-500', 'border-roast-500', 'border-plum-500');
    el.classList.add('bg-transparent', 'text-slate-700', 'dark:text-slate-300');
}

export function setDifficultyChipActive(el, diff) {
    el.classList.remove('bg-transparent', 'text-slate-700', 'dark:text-slate-300');
    if (diff === 'Junior') el.classList.add('bg-pine-500', 'text-white', 'border-pine-500');
    if (diff === 'Middle') el.classList.add('bg-roast-500', 'text-[#2B1904]', 'border-roast-500');
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
    } else if (type === 'master') {
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

