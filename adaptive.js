window.isAdaptivePlanActive = false;

window.checkAdaptiveProgression = function() {
    if (!window.isAdaptivePlanActive) return;
    
    // Find next unmastered
    const nextQ = filteredQuestions.find(q => !masteredIds.includes(q.id));
    if (nextQ) {
        // Load next
        if(typeof loadQuestion === 'function') {
            loadQuestion(nextQ);
            if(typeof buildSidebarList === 'function') buildSidebarList();
        }
    } else {
        // Plan complete!
        window.isAdaptivePlanActive = false;
        document.getElementById('my-roadmap-btn').classList.add('hidden');
        document.getElementById('my-roadmap-btn').classList.remove('flex');
        
        // Reset search filter
        document.getElementById('search-input').value = "";
        if(typeof triggerFilterAction === 'function') triggerFilterAction();
        
        // Show success modal
        const successModal = document.getElementById('adaptive-success-modal');
        if (successModal) {
            successModal.classList.remove('hidden');
            setTimeout(() => successModal.classList.remove('opacity-0', 'scale-95'), 10);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const adaptiveBtn = document.getElementById('adaptive-btn');
    const modal = document.getElementById('adaptive-modal');
    const closeBtn = document.getElementById('close-adaptive-modal');
    
    const step1 = document.getElementById('adaptive-step-1');
    const step2 = document.getElementById('adaptive-step-2');
    const step3 = document.getElementById('adaptive-step-3');
    
    const levelBtns = document.querySelectorAll('.level-select-btn');
    const applyPlanBtn = document.getElementById('apply-adaptive-plan');
    
    const roadmapModal = document.getElementById('adaptive-roadmap-modal');
    const closeRoadmapBtn = document.getElementById('close-roadmap-modal');
    const roadmapContent = document.getElementById('roadmap-content');
    const myRoadmapBtn = document.getElementById('my-roadmap-btn');
    
    const successModal = document.getElementById('adaptive-success-modal');
    const closeSuccessBtn = document.getElementById('close-success-modal');
    
    let quizData = [];
    let currentQuizIndex = 0;
    let selectedLevel = 'Middle';
    let failedTags = new Set();
    
    // Load quiz data
    async function loadQuizData() {
        try {
            const res = await fetch('quiz.json?t=' + new Date().getTime());
            quizData = await res.json();
            quizData.sort(() => Math.random() - 0.5);
        } catch (e) {
            console.error("Failed to load quiz.json", e);
        }
    }
    
    if (adaptiveBtn) {
        adaptiveBtn.addEventListener('click', async () => {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            step3.classList.add('hidden');
            failedTags.clear();
            currentQuizIndex = 0;
            if (quizData.length === 0) await loadQuizData();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        });
    }
    
    if (closeRoadmapBtn) {
        closeRoadmapBtn.addEventListener('click', () => {
            roadmapModal.classList.add('opacity-0');
            setTimeout(() => roadmapModal.classList.add('hidden'), 300);
        });
    }
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.classList.add('opacity-0', 'scale-95');
            setTimeout(() => successModal.classList.add('hidden'), 300);
        });
    }
    
    if (myRoadmapBtn) {
        myRoadmapBtn.addEventListener('click', () => {
            console.log("My Roadmap button clicked!");
            try {
                if (typeof window.renderRoadmap === 'function') {
                    window.renderRoadmap();
                }
                if (roadmapModal) {
                    roadmapModal.classList.remove('hidden');
                    roadmapModal.style.display = 'flex'; // Ensure it's treated as flex
                    setTimeout(() => roadmapModal.classList.remove('opacity-0'), 10);
                } else {
                    console.error("roadmapModal not found!");
                }
            } catch (err) {
                console.error("Error in myRoadmapBtn click:", err);
            }
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
        document.getElementById('quiz-progress-text').innerText = `Question ${currentQuizIndex + 1} of ${quizData.length}`;
        document.getElementById('quiz-progress-bar').style.width = `${((currentQuizIndex) / quizData.length) * 100}%`;
        document.getElementById('quiz-question-text').innerText = q.question;
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300";
            btn.innerText = opt;
            btn.addEventListener('click', () => {
                if (idx !== q.correctIndex) q.testedTags.forEach(tag => failedTags.add(tag));
                currentQuizIndex++;
                renderQuizQuestion();
            });
            optionsContainer.appendChild(btn);
        });
    }
    
    function finishQuiz() {
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
        let msg = "Excellent result! You have almost no knowledge gaps.";
        if (failedTags.size > 0) {
            msg = `We found knowledge gaps in the following topics: ${Array.from(failedTags).join(', ')}. Your plan is ready!`;
        }
        document.getElementById('quiz-results-text').innerText = msg;
    }
    
    window.renderRoadmap = function() {
        try {
            if (!roadmapContent) return;
            roadmapContent.innerHTML = '';
            
            // Check if filteredQuestions is accessible
            const questions = typeof filteredQuestions !== 'undefined' ? filteredQuestions : [];
            if (!questions || questions.length === 0) {
                roadmapContent.innerHTML = '<p class="text-slate-500">Your roadmap is empty.</p>';
                return;
            }
            
            const mArray = (typeof masteredIds !== 'undefined' && Array.isArray(masteredIds)) ? masteredIds : [];
            
            // Group by topic
            const grouped = {};
            questions.forEach(q => {
                const topic = q.topic || 'General';
                if (!grouped[topic]) grouped[topic] = [];
                grouped[topic].push(q);
            });
            
            for (const [topic, qList] of Object.entries(grouped)) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'mb-8';
                
                const groupTitle = document.createElement('h3');
                groupTitle.className = 'text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2';
                groupTitle.innerHTML = `<i class="fa-solid fa-folder-open text-amber-500"></i><span>${topic}</span><span class="text-sm font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">${qList.length}</span>`;
                groupDiv.appendChild(groupTitle);
                
                const listDiv = document.createElement('div');
                listDiv.className = 'space-y-3';
                
                qList.forEach(q => {
                    const isMastered = mArray.includes(q.id);
                    const qDiv = document.createElement('div');
                    qDiv.className = `p-4 rounded-xl border flex justify-between items-center transition-all ${isMastered ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-brand-500/30 hover:shadow-md'}`;
                    
                    const left = document.createElement('div');
                    left.className = 'flex items-center space-x-3';
                    if (isMastered) {
                        left.innerHTML = `<div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"><i class="fa-solid fa-check"></i></div>`;
                    } else {
                        left.innerHTML = `<div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center shrink-0"><i class="fa-solid fa-book"></i></div>`;
                    }
                    
                    const title = document.createElement('div');
                    title.className = `font-semibold ${isMastered ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`;
                    const qText = q.question || 'Question';
                    title.innerText = q.id + ': ' + (qText.length > 60 ? qText.substring(0,60)+'...' : qText);
                    left.appendChild(title);
                    
                    const right = document.createElement('div');
                    if (!isMastered) {
                        const studyBtn = document.createElement('button');
                        studyBtn.className = 'px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors';
                        studyBtn.innerText = 'Study Now';
                        studyBtn.onclick = () => {
                            if (roadmapModal) {
                                roadmapModal.classList.add('opacity-0');
                                setTimeout(() => roadmapModal.classList.add('hidden'), 300);
                            }
                            if (typeof loadQuestion === 'function') {
                                loadQuestion(q);
                                if(typeof buildSidebarList === 'function') buildSidebarList();
                            }
                        };
                        right.appendChild(studyBtn);
                    } else {
                        const doneSpan = document.createElement('span');
                        doneSpan.className = 'text-emerald-500 font-bold text-sm px-4 py-2';
                        doneSpan.innerText = 'Done';
                        right.appendChild(doneSpan);
                    }
                    
                    qDiv.appendChild(left);
                    qDiv.appendChild(right);
                    listDiv.appendChild(qDiv);
                });
                
                groupDiv.appendChild(listDiv);
                roadmapContent.appendChild(groupDiv);
            }
        } catch (err) {
            console.error("Roadmap Render Error:", err);
            if (roadmapContent) roadmapContent.innerHTML = `<p class="text-rose-500 p-4">Error loading roadmap: ${err.message}</p>`;
        }
    };
    
    if (applyPlanBtn) {
        applyPlanBtn.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
            
            if (typeof questionsList !== 'undefined') {
                const diffSelect = document.querySelector(`.diff-chip[data-diff="${selectedLevel}"]`);
                if(diffSelect && typeof toggleDifficulty === 'function') {
                    document.querySelectorAll('.diff-chip').forEach(c => c.classList.remove('ring-2', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-darkCard'));
                    if (typeof selectedDifficulties !== 'undefined') {
                        selectedDifficulties.clear();
                        selectedDifficulties.add(selectedLevel);
                    }
                    const isJunior = selectedLevel === 'Junior';
                    const isMiddle = selectedLevel === 'Middle';
                    diffSelect.classList.add('ring-2', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-darkCard', 
                        isJunior ? 'ring-emerald-500' : isMiddle ? 'ring-amber-500' : 'ring-rose-500');
                }
                
                filteredQuestions = questionsList.filter(q => {
                    const matchDiff = q.difficulty === selectedLevel || (q.difficulty === 'All');
                    if (failedTags.size === 0) return matchDiff;
                    if (!q.tags || q.tags.length === 0) return false;
                    const hasFailedTag = q.tags.some(tag => failedTags.has(tag));
                    return matchDiff && hasFailedTag;
                });
                
                if (filteredQuestions.length > 0) {
                    window.isAdaptivePlanActive = true;
                    
                    // Show My Roadmap button
                    myRoadmapBtn.classList.remove('hidden');
                    myRoadmapBtn.classList.add('flex');
                    
                    // Show roadmap modal
                    if (typeof window.renderRoadmap === 'function') {
                        window.renderRoadmap();
                    }
                    if (roadmapModal) {
                        roadmapModal.classList.remove('hidden');
                        roadmapModal.style.display = 'flex';
                        setTimeout(() => roadmapModal.classList.remove('opacity-0'), 10);
                    }
                    
                    if (typeof buildSidebarList === 'function') buildSidebarList();
                    document.getElementById('search-input').value = `[Adaptive Plan] Tags: ${Array.from(failedTags).join(',')}`;
                    
                    // Auto-load first unmastered
                    checkAdaptiveProgression();
                } else {
                    const successModal = document.getElementById('adaptive-success-modal');
                    if (successModal) {
                        successModal.classList.remove('hidden');
                        setTimeout(() => successModal.classList.remove('opacity-0', 'scale-95'), 10);
                    }
                }
            }
        });
    }
});
