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
    el.classList.remove('bg-success-500', 'bg-brand-500', 'bg-purple-500', 'text-white', 'border-success-500', 'border-brand-500', 'border-purple-500');
    el.classList.add('bg-transparent', 'text-slate-700', 'dark:text-slate-300');
}

export function setDifficultyChipActive(el, diff) {
    el.classList.remove('bg-transparent', 'text-slate-700', 'dark:text-slate-300');
    if (diff === 'Junior') el.classList.add('bg-success-500', 'text-white', 'border-success-500');
    if (diff === 'Middle') el.classList.add('bg-brand-500', 'text-white', 'border-brand-500');
    if (diff === 'Senior') el.classList.add('bg-purple-500', 'text-white', 'border-purple-500');
}
