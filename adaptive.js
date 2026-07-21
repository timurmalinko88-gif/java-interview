document.addEventListener('DOMContentLoaded', () => {
    const adaptiveBtn = document.getElementById('adaptive-btn');
    const modal = document.getElementById('adaptive-modal');
    const closeBtn = document.getElementById('close-adaptive-modal');
    
    const step1 = document.getElementById('adaptive-step-1');
    const step2 = document.getElementById('adaptive-step-2');
    const step3 = document.getElementById('adaptive-step-3');
    
    const levelBtns = document.querySelectorAll('.level-select-btn');
    const applyPlanBtn = document.getElementById('apply-adaptive-plan');
    
    let quizData = [];
    let currentQuizIndex = 0;
    let selectedLevel = 'Middle';
    let failedTags = new Set();
    
    // Load quiz data
    async function loadQuizData() {
        try {
            const res = await fetch('quiz.json');
            quizData = await res.json();
            // Shuffle
            quizData.sort(() => Math.random() - 0.5);
        } catch (e) {
            console.error("Failed to load quiz.json", e);
        }
    }
    
    if (adaptiveBtn) {
        adaptiveBtn.addEventListener('click', async () => {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
            
            // Reset state
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            step3.classList.add('hidden');
            failedTags.clear();
            currentQuizIndex = 0;
            
            if (quizData.length === 0) {
                await loadQuizData();
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        });
    }
    
    levelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedLevel = e.target.getAttribute('data-level');
            document.getElementById('quiz-level-badge').innerText = selectedLevel;
            
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            
            renderQuizQuestion();
        });
    });
    
    function renderQuizQuestion() {
        if (currentQuizIndex >= quizData.length) {
            finishQuiz();
            return;
        }
        
        const q = quizData[currentQuizIndex];
        document.getElementById('quiz-progress-text').innerText = `Вопрос ${currentQuizIndex + 1} из ${quizData.length}`;
        document.getElementById('quiz-progress-bar').style.width = `${((currentQuizIndex) / quizData.length) * 100}%`;
        
        document.getElementById('quiz-question-text').innerText = q.question;
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300";
            btn.innerText = opt;
            btn.addEventListener('click', () => handleAnswer(idx, q));
            optionsContainer.appendChild(btn);
        });
    }
    
    function handleAnswer(selectedIndex, q) {
        if (selectedIndex !== q.correctIndex) {
            q.testedTags.forEach(tag => failedTags.add(tag));
        }
        currentQuizIndex++;
        renderQuizQuestion();
    }
    
    function finishQuiz() {
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
        
        let msg = "Отличный результат! У вас почти нет пробелов.";
        if (failedTags.size > 0) {
            msg = `Мы обнаружили пробелы в темах: ${Array.from(failedTags).join(', ')}. План составлен!`;
        }
        document.getElementById('quiz-results-text').innerText = msg;
    }
    
    if (applyPlanBtn) {
        applyPlanBtn.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
            
            // Apply filtering logic using global questionsList
            if (typeof window.questionsList !== 'undefined') {
                const diffSelect = document.querySelector(`.diff-chip[data-diff="${selectedLevel}"]`);
                if(diffSelect && typeof window.toggleDifficulty === 'function') {
                    // Reset all
                    document.querySelectorAll('.diff-chip').forEach(c => c.classList.remove('ring-2', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-darkCard'));
                    window.selectedDifficulties.clear();
                    
                    // Select current
                    window.selectedDifficulties.add(selectedLevel);
                    const isJunior = selectedLevel === 'Junior';
                    const isMiddle = selectedLevel === 'Middle';
                    diffSelect.classList.add('ring-2', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-darkCard', 
                        isJunior ? 'ring-emerald-500' : isMiddle ? 'ring-amber-500' : 'ring-rose-500');
                }
                
                // Advanced filtering based on tags
                window.filteredQuestions = window.questionsList.filter(q => {
                    const matchDiff = q.difficulty === selectedLevel || (q.difficulty === 'All');
                    
                    // If no failed tags, just show all for this level
                    if (failedTags.size === 0) return matchDiff;
                    
                    // If they failed some tags, only include questions that have AT LEAST ONE failed tag
                    if (!q.tags || q.tags.length === 0) return false;
                    
                    const hasFailedTag = q.tags.some(tag => failedTags.has(tag));
                    return matchDiff && hasFailedTag;
                });
                
                // Update UI
                if (typeof window.buildSidebarList === 'function') {
                    window.buildSidebarList();
                    // Auto-select first
                    if(window.filteredQuestions.length > 0) {
                        if(typeof window.loadQuestion === 'function') {
                            window.loadQuestion(window.filteredQuestions[0]);
                        }
                    }
                }
                
                // Show a toast or update header
                document.getElementById('search-input').value = `[Adaptive Plan] Tags: ${Array.from(failedTags).join(',')}`;
            }
        });
    }
});
