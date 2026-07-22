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
    el.classList.remove('bg-brand-500', 'text-white', 'border-brand-500');
    if (diff === 'Junior') el.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400');
    if (diff === 'Middle') el.classList.add('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400');
    if (diff === 'Senior') el.classList.add('bg-purple-500/10', 'text-purple-600', 'dark:text-purple-400');
}

export function setDifficultyChipActive(el) {
    el.classList.remove('bg-emerald-500/10', 'bg-blue-500/10', 'bg-purple-500/10', 'text-emerald-600', 'text-blue-600', 'text-purple-600', 'dark:text-emerald-400', 'dark:text-blue-400', 'dark:text-purple-400');
    el.classList.add('bg-brand-500', 'text-white', 'border-brand-500');
}
