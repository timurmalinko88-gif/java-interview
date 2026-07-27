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
