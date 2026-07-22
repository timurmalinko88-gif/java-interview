// Initialize and load dynamic questions indexes
async function fetchQuestions() {
    try {
        // Try fetching index.json dynamically.
        const response = await fetch('index.json');
        if (!response.ok) throw new Error("Index file not found");
        const data = await response.json();
        
        if (data && data.questions && data.questions.length > 0) {
            questionsList = data.questions;
        } else {
            questionsList = [...fallbackDatabase];
        }
    } catch (err) {
        console.log("Using rich embedded fallback database.");
        questionsList = [...fallbackDatabase];
    }

    filteredQuestions = [...questionsList];
    loadPersistence();
    buildSidebarList();
    await loadQuestion(0);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Load and initialize core engine
    fetchQuestions();

    // Mock Interview listeners
    const mockInterviewBtn = document.getElementById('mock-interview-btn');
    if (mockInterviewBtn) mockInterviewBtn.onclick = openMockSetup;
    
    const closeMockSetupBtn = document.getElementById('close-mock-setup-btn');
    if (closeMockSetupBtn) closeMockSetupBtn.onclick = closeMockSetup;
    
    const startMockBtn = document.getElementById('start-mock-btn');
    if (startMockBtn) startMockBtn.onclick = startMockInterview;
    
    const exitMockBtn = document.getElementById('exit-mock-btn');
    if (exitMockBtn) exitMockBtn.onclick = exitMockInterview;
    
    const finishMockBtn = document.getElementById('finish-mock-btn');
    if (finishMockBtn) finishMockBtn.onclick = () => {
        document.getElementById('mock-results-modal').classList.add('hidden');
    };

    // Grade selection buttons inside setup modal
    document.querySelectorAll('.mock-grade-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.mock-grade-btn').forEach(b => {
                b.classList.remove('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
                b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
            });
            btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
            btn.classList.add('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
            mockSelectedGrade = btn.getAttribute('data-mock-grade');
        };
    });

    // Company selection buttons inside setup modal
    document.querySelectorAll('.mock-company-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.mock-company-btn').forEach(b => {
                b.classList.remove('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
                b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
            });
            btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
            btn.classList.add('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
            mockSelectedCompany = btn.getAttribute('data-mock-company');
        };
    });

    // Evaluation buttons
    const evalMissedBtn = document.getElementById('eval-missed-btn');
    if (evalMissedBtn) evalMissedBtn.onclick = () => evaluateMockQuestion(0);
    
    const evalPartialBtn = document.getElementById('eval-partial-btn');
    if (evalPartialBtn) evalPartialBtn.onclick = () => evaluateMockQuestion(5);
    
    const evalNailedBtn = document.getElementById('eval-nailed-btn');
    if (evalNailedBtn) evalNailedBtn.onclick = () => evaluateMockQuestion(10);

    // Toggle Answer actions event triggers
    const btnAnswer = document.getElementById('btn-answer');
    if (btnAnswer) {
        btnAnswer.onclick = () => {
            if (isMockMode) {
                revealMockAnswer();
                return;
            }
            if (isAnswerVisible) {
                hideAnswerSection();
            } else {
                renderAnswerContent();
            }
        };
    }

    // Previous and Next button actions
    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) {
        btnPrev.onclick = async () => {
            if (currentIndex > 0) {
                currentIndex--;
                isAnswerVisible = false;
                await loadQuestion(currentIndex);
                buildSidebarList();
            }
        };
    }

    const btnNext = document.getElementById('btn-next');
    if (btnNext) {
        btnNext.onclick = async () => {
            if (currentIndex < filteredQuestions.length - 1) {
                currentIndex++;
                isAnswerVisible = false;
                await loadQuestion(currentIndex);
                buildSidebarList();
            }
        };
    }

    // Flag / Bookmark toggling
    const flagBtn = document.getElementById('flag-btn');
    if (flagBtn) {
        flagBtn.onclick = () => {
            if (filteredQuestions.length === 0) return;
            const activeId = filteredQuestions[currentIndex].id;
            const idx = flaggedIds.indexOf(activeId);

            if (idx > -1) {
                flaggedIds.splice(idx, 1);
                showToast("Removed from bookmarks", "info");
            } else {
                flaggedIds.push(activeId);
                showToast("Added to bookmarks!", "bookmark");
            }
            
            savePersistence();
            syncActionButtons(activeId);
            buildSidebarList();
        };
    }

    // Mastered toggle trigger
    const masteredBtn = document.getElementById('mastered-btn');
    if (masteredBtn) {
        masteredBtn.onclick = () => {
            if (filteredQuestions.length === 0) return;
            const activeId = filteredQuestions[currentIndex].id;
            const idx = masteredIds.indexOf(activeId);

            if (idx > -1) {
                masteredIds.splice(idx, 1);
                showToast("Question возвращен к изучению", "info");
            } else {
                masteredIds.push(activeId);
                showToast("Congratulations! Marked as mastered 👍", "success");
            }

            savePersistence();
            syncActionButtons(activeId);
            buildSidebarList();
            
            // Adaptive Plan hook
            if (typeof checkAdaptiveProgression === 'function') {
                checkAdaptiveProgression();
            }
        };
    }

    // Filters updates triggers
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.oninput = triggerFilterAction;
    
    const topicFilter = document.getElementById('topic-filter');
    if (topicFilter) topicFilter.onchange = triggerFilterAction;
    
    document.querySelectorAll('.format-checkbox').forEach(el => {
        el.onchange = triggerFilterAction;
    });

    // Difficulty chips actions handlers
    document.querySelectorAll('.diff-chip').forEach(el => {
        el.onclick = () => {
            const difficulty = el.getAttribute('data-diff');
            const idx = selectedDiffFilters.indexOf(difficulty);

            if (idx > -1) {
                selectedDiffFilters.splice(idx, 1);
                // Restore visual inactive style
                el.classList.remove('bg-brand-500', 'text-white', 'border-brand-500');
                if (difficulty === 'Junior') el.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400');
                if (difficulty === 'Middle') el.classList.add('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400');
                if (difficulty === 'Senior') el.classList.add('bg-purple-500/10', 'text-purple-600', 'dark:text-purple-400');
            } else {
                selectedDiffFilters.push(difficulty);
                // Render active highlight styles depending on selection
                el.classList.remove('bg-emerald-500/10', 'bg-blue-500/10', 'bg-purple-500/10', 'text-emerald-600', 'text-blue-600', 'text-purple-600', 'dark:text-emerald-400', 'dark:text-blue-400', 'dark:text-purple-400');
                el.classList.add('bg-brand-500', 'text-white', 'border-brand-500');
            }
            triggerFilterAction();
        };
    });

    // Clear filter actions Link
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) clearFiltersBtn.onclick = clearAllFilters;

    // Blitz random questions selection
    const blitzBtn = document.getElementById('blitz-btn');
    if (blitzBtn) {
        blitzBtn.onclick = async () => {
            if (questionsList.length === 0) return;
            const randomIdx = Math.floor(Math.random() * questionsList.length);
            
            // Clear any filters that would hide our random blitz choice
            clearAllFilters();
            
            // Find matching active cursor index
            currentIndex = filteredQuestions.findIndex(q => q.id === questionsList[randomIdx].id);
            isAnswerVisible = false;
            
            await loadQuestion(currentIndex);
            buildSidebarList();
            showToast("Режим блиц: Выбран случайный вопрос!", "info");
        };
    }

    // Copy source code to clipboards
    const copyCodeBtn = document.getElementById('copy-code-btn');
    if (copyCodeBtn) {
        copyCodeBtn.onclick = () => {
            const codeText = document.getElementById('code-content').textContent;
            // Workaround context boundary copy restriction fallback
            const textarea = document.createElement('textarea');
            textarea.value = codeText;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showToast("Код успешно скопирован!", "success");
            } catch (err) {
                showToast("Не удалось скопировать код", "info");
            }
            document.body.removeChild(textarea);
        };
    }

    // Theme toggle triggers
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.onclick = () => {
            const isDark = document.documentElement.classList.toggle('dark');
            
            // Toggle Highlight styles
            document.getElementById('hljs-dark-theme').disabled = !isDark;
            document.getElementById('hljs-light-theme').disabled = isDark;

            showToast(isDark ? "Темная тема включена" : "Светлая тема включена", "info");
        };
    }

    // Setup Stats Modal
    const statsBtn = document.getElementById('my-stats-btn');
    const statsModal = document.getElementById('stats-dashboard-modal');
    const closeStatsBtn = document.getElementById('close-stats-modal');

    if (statsBtn && statsModal) {
        statsBtn.onclick = () => {
            if (typeof updateStatsDashboard === 'function') {
                updateStatsDashboard();
            }
            statsModal.classList.remove('hidden');
            statsModal.style.display = 'flex';
            setTimeout(() => statsModal.classList.remove('opacity-0'), 10);
        };
    }

    if (closeStatsBtn && statsModal) {
        closeStatsBtn.onclick = () => {
            statsModal.classList.add('opacity-0');
            setTimeout(() => {
                statsModal.classList.add('hidden');
                statsModal.style.display = '';
            }, 300);
        };
    }

    // Hotkeys Feature
    document.addEventListener('keydown', async (e) => {
        // Do not trigger hotkeys if user is typing in the search input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Skip hotkeys if any modal is open
        if (!document.getElementById('adaptive-modal').classList.contains('hidden') ||
            !document.getElementById('adaptive-roadmap-modal').classList.contains('hidden') ||
            (statsModal && !statsModal.classList.contains('hidden')) ||
            !document.getElementById('mock-setup-modal').classList.contains('hidden') ||
            !document.getElementById('mock-results-modal').classList.contains('hidden')) {
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                if (btnNext && !btnNext.disabled) btnNext.onclick();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (btnPrev && !btnPrev.disabled) btnPrev.onclick();
                break;
            case ' ': // Spacebar
                e.preventDefault();
                if (btnAnswer) btnAnswer.onclick();
                break;
            case 'm':
            case 'M':
            case 'ь': // Russian layout 'M'
            case 'Ь':
                e.preventDefault();
                if (masteredBtn) masteredBtn.onclick();
                break;
            case 'f':
            case 'F':
            case 'а': // Russian layout 'F'
            case 'А':
                e.preventDefault();
                if (flagBtn) flagBtn.onclick();
                break;
        }
    });

});
