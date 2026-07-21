// Build the left sidebar navigation items
function buildSidebarList() {
    const container = document.getElementById('questions-container');
    const countLabel = document.getElementById('question-list-count');
    
    container.innerHTML = '';
    countLabel.textContent = filteredQuestions.length;

    if (filteredQuestions.length === 0) {
        renderNoQuestionsFoundState();
        return;
    }

    filteredQuestions.forEach((q, idx) => {
        const isMastered = masteredIds.includes(q.id);
        const isFlagged = flaggedIds.includes(q.id);
        const isActive = idx === currentIndex;

        // Color configuration for difficulties
        let diffStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
        if (q.difficulty === 'Middle') diffStyle = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
        if (q.difficulty === 'Senior') diffStyle = 'bg-purple-500/10 text-purple-600 dark:text-purple-400';

        const button = document.createElement('button');
        button.className = `w-full text-left p-4 transition-all duration-200 border-l-4 flex flex-col space-y-2 ${
            isActive 
            ? 'bg-slate-100 dark:bg-slate-800/80 border-brand-500' 
            : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'
        }`;

        // Extract short question label
        const shortQuestionText = q.title || q.question || q.id;

        button.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-1.5">
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${diffStyle}">
                        ${q.difficulty}
                    </span>
                    <span class="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        ${q.topic}
                    </span>
                </div>
                <div class="flex items-center space-x-1">
                    ${isMastered ? '<i class="fa-solid fa-circle-check text-emerald-500 text-xs"></i>' : ''}
                    ${isFlagged ? '<i class="fa-solid fa-bookmark text-amber-500 text-xs"></i>' : ''}
                </div>
            </div>
            <h4 class="text-xs font-bold leading-snug line-clamp-2 ${isActive ? 'text-brand-500' : 'text-slate-700 dark:text-slate-300'}">
                ${shortQuestionText}
            </h4>
        `;

        button.onclick = async () => {
            currentIndex = idx;
            isAnswerVisible = false;
            await loadQuestion(idx);
            buildSidebarList();
        };

        container.appendChild(button);
    });
}

// Filter actions triggered on inputs change
function triggerFilterAction() {
    const searchValue = document.getElementById('search-input').value.toLowerCase().trim();
    const topicValue = document.getElementById('topic-filter').value;
    
    // Checkboxes for format
    const checkedFormats = Array.from(document.querySelectorAll('.format-checkbox:checked')).map(el => el.value);

    filteredQuestions = questionsList.filter(q => {
        // Search Matches
        const searchMatches = (q.question && q.question.toLowerCase().includes(searchValue)) || 
                              (q.id && q.id.toLowerCase().includes(searchValue)) ||
                              (q.loadedQuestion && q.loadedQuestion.toLowerCase().includes(searchValue)) ||
                              (q.loadedAnswer && q.loadedAnswer.toLowerCase().includes(searchValue));
        
        // Topic Matches
        const topicMatches = topicValue === 'all' || q.topic === topicValue;

        // Difficulty Matches
        const diffMatches = selectedDiffFilters.length === 0 || selectedDiffFilters.includes(q.difficulty);

        // Format Matches
        const formatMatches = checkedFormats.length === 0 || checkedFormats.includes(q.format);

        return searchMatches && topicMatches && diffMatches && formatMatches;
    });

    // Reset cursor if out of bounds
    if (currentIndex >= filteredQuestions.length) {
        currentIndex = 0;
    }

    // Toggle "Clear" filters indicator link
    const hasActiveFilters = searchValue !== '' || topicValue !== 'all' || selectedDiffFilters.length > 0 || checkedFormats.length > 0;
    document.getElementById('clear-filters').style.display = hasActiveFilters ? 'inline' : 'none';

    buildSidebarList();
    if (filteredQuestions.length > 0) {
        loadQuestion(currentIndex);
    }
}

// Reset global filter selections
function clearAllFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('topic-filter').value = 'all';
    
    selectedDiffFilters = [];
    document.querySelectorAll('.diff-chip').forEach(el => {
        el.classList.remove('bg-brand-500', 'text-white', 'border-brand-500');
        const diff = el.getAttribute('data-diff');
        if (diff === 'Junior') el.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400');
        if (diff === 'Middle') el.classList.add('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400');
        if (diff === 'Senior') el.classList.add('bg-purple-500/10', 'text-purple-600', 'dark:text-purple-400');
    });

    document.querySelectorAll('.format-checkbox').forEach(el => el.checked = false);
    
    triggerFilterAction();
}

// Sync UI global stats metrics
function updateStatsUI() {
    const total = questionsList.length;
    if (total === 0) return;

    const masteredCount = masteredIds.length;
    
    // Gamification Logic
    const xp = masteredCount * 10;
    let rank = "Intern";
    if (xp >= 5000) rank = "Staff Engineer";
    else if (xp >= 3000) rank = "Senior";
    else if (xp >= 1500) rank = "Middle";
    else if (xp >= 500) rank = "Junior";

    const statsXpEl = document.getElementById('stats-xp');
    if (statsXpEl) statsXpEl.textContent = xp + ' XP';
    
    const statsRankEl = document.getElementById('stats-rank');
    if (statsRankEl) statsRankEl.textContent = rank;

    // Calculate percentage progress for globally tracked completion progress bar
    const percent = Math.min(100, Math.round((masteredCount / total) * 100));
    const statsProgEl = document.getElementById('stats-progress');
    if (statsProgEl) statsProgEl.textContent = `${percent}% (${masteredCount}/${total})`;
    
    const globalProgEl = document.getElementById('global-progress');
    if (globalProgEl) globalProgEl.style.width = `${percent}%`;
}

// Parse the canonical Markdown format
function parseMarkdown(text) {
    const result = { question: '', answer: '', code: '', analogy: '', keyPoints: '' };
    const cleanText = text.replace(/^---[\s\S]*?---\s*/m, '').trim();
    
    const parts = cleanText.split('---ANSWER---');
    result.question = parts[0] ? parts[0].trim() : '';
    let rawAnswer = parts[1] ? parts[1].trim() : '';

    const codeMatch = rawAnswer.match(/```java\s*\n([\s\S]*?)\n```/i) || result.question.match(/```java\s*\n([\s\S]*?)\n```/i);
    if (codeMatch) result.code = codeMatch[1];
    
    // Extract Analogy
    const analogyMatch = rawAnswer.match(/###\s*Life Analogy\s*\n([\s\S]*?)(?=###|$)/i);
    if (analogyMatch) {
        result.analogy = analogyMatch[1].trim();
        rawAnswer = rawAnswer.replace(analogyMatch[0], '');
    }

    // Extract Key Points
    const keyPointsMatch = rawAnswer.match(/###\s*Key Points\s*\n([\s\S]*?)(?=###|$)/i);
    if (keyPointsMatch) {
        result.keyPoints = keyPointsMatch[1].trim();
        rawAnswer = rawAnswer.replace(keyPointsMatch[0], '');
    }

    result.answer = rawAnswer.trim();
    return result;
}

// Handle dynamically loading file content or pulling from fallbacks
async function loadQuestion(index) {
    if (filteredQuestions.length === 0) {
        renderNoQuestionsFoundState();
        return;
    }

    const q = filteredQuestions[index];

    // Update Header Meta Immediately for maximum responsiveness
    const diffEl = document.getElementById('active-difficulty');
    diffEl.textContent = q.difficulty;
    diffEl.className = 'px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ';
    if (q.difficulty === 'Junior') {
        diffEl.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400');
    } else if (q.difficulty === 'Middle') {
        diffEl.classList.add('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400');
    } else {
        diffEl.classList.add('bg-purple-500/10', 'text-purple-600', 'dark:text-purple-400');
    }

    document.getElementById('active-topic').textContent = q.topic;
    document.getElementById('active-id').textContent = '#' + q.id;
    document.getElementById('active-format').textContent = q.format;
    document.getElementById('counter').textContent = `${index + 1} / ${filteredQuestions.length}`;

    // Render Extra Metadata
    const extraMetaContainer = document.getElementById('extra-metadata');
    extraMetaContainer.innerHTML = '';
    if (q.time) {
        extraMetaContainer.innerHTML += `<span class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded"><i class="fa-regular fa-clock text-amber-500"></i> ${q.time} мин</span>`;
    }
    if (q.frequency) {
        extraMetaContainer.innerHTML += `<span class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded"><i class="fa-solid fa-fire-flame-curved text-brand-500"></i> Frequency: ${q.frequency}</span>`;
    }
    if (q.related && q.related.length > 0) {
        extraMetaContainer.innerHTML += `<span class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded"><i class="fa-solid fa-link text-blue-500"></i> ${Array.isArray(q.related) ? q.related.join(', ') : q.related}</span>`;
    }

    // Reset action bookmark/completed status indicators
    syncActionButtons(q.id);

    // Hide the answer sections
    const answerSection = document.getElementById('answer-section');
    answerSection.classList.add('hidden');
    const ansBtnText = document.getElementById('btn-answer-text');
    const ansBtnIcon = document.getElementById('btn-answer-icon');
    ansBtnText.textContent = "Show Answer";
    ansBtnIcon.className = "fa-solid fa-eye";
    isAnswerVisible = false;

    // Display loading indicators
    const questionTextEl = document.getElementById('question-text');
    questionTextEl.innerHTML = `
        <div class="flex items-center space-x-2 text-slate-400 py-4 animate-pulse">
            <i class="fa-solid fa-spinner fa-spin text-brand-500"></i>
            <span>Loading question content...</span>
        </div>
    `;
    document.getElementById('code-section').classList.add('hidden');

    // If question has not been loaded before, fetch it dynamically
    if (!q.loadedQuestion) {
        let parsedContent = null;
        
        if (q.path) {
            try {
                const response = await fetch(q.path);
                if (!response.ok) throw new Error("File fetch failed");
                const markdownText = await response.text();
                parsedContent = parseMarkdown(markdownText);
            } catch (err) {
                console.warn(`Dynamic fetch failed for ${q.path}, loading fallback item.`, err);
            }
        }

        // Match with embedded static database
        if (!parsedContent) {
            const fallbackObj = fallbackDatabase.find(f => f.id === q.id) || fallbackDatabase.find(f => f.id === "jvm-001");
            parsedContent = {
                question: fallbackObj.question,
                answer: fallbackObj.answer,
                code: fallbackObj.code,
                analogy: fallbackObj.analogy
            };
        }

        // Cache the loaded fields onto the active question object to optimize toggles and navigation
        q.loadedQuestion = parsedContent.question;
        q.loadedAnswer = parsedContent.answer;
        q.loadedCode = parsedContent.code;
        q.loadedAnalogy = parsedContent.analogy;
        
        // If question title in original list was empty, enrich it dynamically
        if (!q.question) {
            q.question = parsedContent.question.split('\n')[0].replace(/[#*`]/g, '').trim();
            buildSidebarList();
        }
    }

    // Render Markdown Question Content
    questionTextEl.innerHTML = marked.parse(q.loadedQuestion || "No question content.");

    // Display code section if Java source is present
    const codeSec = document.getElementById('code-section');
    if (q.loadedCode && q.loadedCode.trim() !== '') {
        codeSec.classList.remove('hidden');
        const codeContent = document.getElementById('code-content');
        codeContent.textContent = q.loadedCode;
        codeContent.removeAttribute('data-highlighted');
        hljs.highlightElement(codeContent);
    } else {
        codeSec.classList.add('hidden');
    }

    // Manage navigation boundaries
    document.getElementById('btn-prev').disabled = currentIndex === 0;
    document.getElementById('btn-next').disabled = currentIndex === filteredQuestions.length - 1;
}

// Synch flag/mastered active buttons styling state
function syncActionButtons(activeId) {
    const isFlagged = flaggedIds.includes(activeId);
    const flagBtn = document.getElementById('flag-btn');
    if (isFlagged) {
        flagBtn.classList.add('bg-amber-500/10', 'text-amber-500', 'border-amber-500/30');
        flagBtn.classList.remove('text-slate-400');
    } else {
        flagBtn.classList.remove('bg-amber-500/10', 'text-amber-500', 'border-amber-500/30');
        flagBtn.classList.add('text-slate-400');
    }

    const isMastered = masteredIds.includes(activeId);
    const masteredBtn = document.getElementById('mastered-btn');
    if (isMastered) {
        masteredBtn.classList.add('bg-emerald-500/10', 'text-emerald-500', 'border-emerald-500/30');
        masteredBtn.classList.remove('text-slate-400');
    } else {
        masteredBtn.classList.remove('bg-emerald-500/10', 'text-emerald-500', 'border-emerald-500/30');
        masteredBtn.classList.add('text-slate-400');
    }
}

// Render empty layout inside questions wrapper
function renderNoQuestionsFoundState() {
    const card = document.getElementById('main-content-card');
    card.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 text-2xl">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Nothing Found</h3>
            <p class="text-sm text-slate-400 max-w-sm">Reset filters to see the full list of preparation questions.</p>
            <button onclick="clearAllFilters()" class="mt-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">
                Reset фильтры
            </button>
        </div>
    `;
}

// Trigger non-intrusive beautiful toast notification message
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const msgSpan = document.getElementById('toast-message');

    msgSpan.textContent = message;

    if (type === 'success') {
        icon.className = "fa-solid fa-circle-check text-emerald-500";
    } else if (type === 'bookmark') {
        icon.className = "fa-solid fa-bookmark text-amber-500";
    } else {
        icon.className = "fa-solid fa-info-circle text-blue-500";
    }

    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
    }, 2500);
}

// Mock Interview Engine State
var isMockMode = false;
var mockQuestions = [];
var mockCurrentIdx = 0;
var mockTimerInterval = null;
var mockTimeRemaining = 0;
var mockScores = [];
var mockSelectedGrade = 'Junior';

function openMockSetup() {
    document.getElementById('mock-setup-modal').classList.remove('hidden');
}

function closeMockSetup() {
    document.getElementById('mock-setup-modal').classList.add('hidden');
}

function startMockInterview() {
    const timeLimit = parseInt(document.getElementById('mock-time-select').value, 10);
    
    // Pool filtering based on target grade
    let candidatePool = questionsList.filter(q => {
        if (mockSelectedGrade === 'Junior') return q.difficulty === 'Junior' || q.difficulty === 'Middle';
        if (mockSelectedGrade === 'Middle') return q.difficulty === 'Middle' || q.difficulty === 'Senior' || q.difficulty === 'Junior';
        return q.difficulty === 'Senior' || q.difficulty === 'Middle';
    });

    if (candidatePool.length === 0) candidatePool = [...questionsList];

    // Shuffle pool (Fisher-Yates)
    for (let i = candidatePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidatePool[i], candidatePool[j]] = [candidatePool[j], candidatePool[i]];
    }

    // Target question count: Junior: 10, Middle: 12, Senior: 15
    let targetCount = 10;
    if (mockSelectedGrade === 'Middle') targetCount = 12;
    if (mockSelectedGrade === 'Senior') targetCount = 15;

    mockQuestions = candidatePool.slice(0, Math.min(targetCount, candidatePool.length));
    mockCurrentIdx = 0;
    mockScores = [];
    isMockMode = true;

    // Timer setup
    if (mockTimerInterval) clearInterval(mockTimerInterval);
    if (timeLimit > 0) {
        mockTimeRemaining = timeLimit * 60;
        updateMockTimerDisplay();
        mockTimerInterval = setInterval(() => {
            mockTimeRemaining--;
            updateMockTimerDisplay();
            if (mockTimeRemaining <= 0) {
                clearInterval(mockTimerInterval);
                showToast("Time's up! Submitting interview...", "info");
                finishMockInterview();
            }
        }, 1000);
    } else {
        document.getElementById('mock-timer-display').textContent = "Untimed";
    }

    closeMockSetup();
    document.getElementById('mock-status-bar').classList.remove('hidden');
    loadMockQuestion(0);
    showToast(`Mock Interview Started (${mockQuestions.length} Questions)`, "success");
}

function updateMockTimerDisplay() {
    const mins = Math.floor(mockTimeRemaining / 60);
    const secs = mockTimeRemaining % 60;
    document.getElementById('mock-timer-display').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function loadMockQuestion(idx) {
    if (idx < 0 || idx >= mockQuestions.length) return;
    mockCurrentIdx = idx;
    
    const q = mockQuestions[idx];
    
    // Temporarily set filteredQuestions to single item list or navigate
    const realIdx = questionsList.findIndex(item => item.id === q.id);
    if (realIdx !== -1) {
        currentIndex = filteredQuestions.findIndex(item => item.id === q.id);
        if (currentIndex === -1) {
            filteredQuestions = [q];
            currentIndex = 0;
        }
    }

    await loadQuestion(currentIndex);
    
    // Adjust UI for mock
    document.getElementById('counter').textContent = `Mock: ${idx + 1} / ${mockQuestions.length}`;
    document.getElementById('mock-eval-bar').classList.add('hidden');
    document.getElementById('mock-eval-bar').classList.remove('flex');
    document.getElementById('btn-answer').classList.remove('hidden');
}

function renderAnswerContent() {
    if (filteredQuestions.length === 0) return;
    const q = filteredQuestions[currentIndex];
    isAnswerVisible = true;
    
    const answerSection = document.getElementById('answer-section');
    const ansBtnText = document.getElementById('btn-answer-text');
    const ansBtnIcon = document.getElementById('btn-answer-icon');

    answerSection.classList.remove('hidden');
    document.getElementById('answer-content').innerHTML = marked.parse(q.loadedAnswer || "No answer content.");

    // Populate intuitive analogy if defined
    const analogySec = document.getElementById('analogy-subsection');
    if (q.loadedAnalogy && q.loadedAnalogy.trim() !== '') {
        analogySec.classList.remove('hidden');
        document.getElementById('analogy-content').textContent = q.loadedAnalogy;
    } else {
        analogySec.classList.add('hidden');
    }

    if (ansBtnText) ansBtnText.textContent = "Hide Answer";
    if (ansBtnIcon) ansBtnIcon.className = "fa-solid fa-eye-slash";
}

function hideAnswerSection() {
    isAnswerVisible = false;
    const answerSection = document.getElementById('answer-section');
    const ansBtnText = document.getElementById('btn-answer-text');
    const ansBtnIcon = document.getElementById('btn-answer-icon');

    answerSection.classList.add('hidden');
    if (ansBtnText) ansBtnText.textContent = "Show Answer";
    if (ansBtnIcon) ansBtnIcon.className = "fa-solid fa-eye";
}

function revealMockAnswer() {
    renderAnswerContent();
    document.getElementById('btn-answer').classList.add('hidden');
    document.getElementById('mock-eval-bar').classList.remove('hidden');
    document.getElementById('mock-eval-bar').classList.add('flex');
}

function evaluateMockQuestion(points) {
    const currentQ = mockQuestions[mockCurrentIdx];
    mockScores.push({
        id: currentQ.id,
        topic: currentQ.topic,
        points: points
    });

    if (points === 10 && !masteredIds.includes(currentQ.id)) {
        masteredIds.push(currentQ.id);
        savePersistence();
    }

    if (mockCurrentIdx + 1 < mockQuestions.length) {
        loadMockQuestion(mockCurrentIdx + 1);
    } else {
        finishMockInterview();
    }
}

function finishMockInterview() {
    if (mockTimerInterval) clearInterval(mockTimerInterval);
    isMockMode = false;
    
    document.getElementById('mock-status-bar').classList.add('hidden');
    document.getElementById('mock-eval-bar').classList.add('hidden');
    document.getElementById('btn-answer').classList.remove('hidden');

    // Calculate results
    const totalQuestions = mockQuestions.length;
    const maxPossibleXP = totalQuestions * 10;
    const totalEarnedXP = mockScores.reduce((acc, curr) => acc + curr.points, 0);
    const scorePercent = maxPossibleXP > 0 ? Math.round((totalEarnedXP / maxPossibleXP) * 100) : 0;

    document.getElementById('mock-result-score').textContent = `${scorePercent}%`;
    document.getElementById('mock-result-xp').textContent = `+${totalEarnedXP} XP`;

    let verdict = "PASSED";
    let verdictColor = "text-emerald-500";
    let badgeIcon = '<i class="fa-solid fa-trophy"></i>';
    let badgeBg = "bg-emerald-500/10 text-emerald-500";

    if (scorePercent < 50) {
        verdict = "NEEDS WORK";
        verdictColor = "text-red-500";
        badgeIcon = '<i class="fa-solid fa-book-open"></i>';
        badgeBg = "bg-red-500/10 text-red-500";
    } else if (scorePercent < 75) {
        verdict = "PARTIAL PASS";
        verdictColor = "text-amber-500";
        badgeIcon = '<i class="fa-solid fa-award"></i>';
        badgeBg = "bg-amber-500/10 text-amber-500";
    }

    document.getElementById('mock-result-verdict').textContent = verdict;
    document.getElementById('mock-result-verdict').className = `text-xs font-bold ${verdictColor} block mt-1`;
    
    const badgeEl = document.getElementById('mock-result-badge-icon');
    badgeEl.className = `w-16 h-16 rounded-2xl ${badgeBg} flex items-center justify-center text-3xl mx-auto`;
    badgeEl.innerHTML = badgeIcon;

    // Topic Breakdown
    const topicStats = {};
    mockScores.forEach(s => {
        const topic = s.topic || "General";
        if (!topicStats[topic]) topicStats[topic] = { earned: 0, total: 0 };
        topicStats[topic].earned += s.points;
        topicStats[topic].total += 10;
    });

    const topicsContainer = document.getElementById('mock-result-topics');
    topicsContainer.innerHTML = '';

    Object.keys(topicStats).forEach(topic => {
        const stat = topicStats[topic];
        const pct = Math.round((stat.earned / stat.total) * 100);
        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs";
        row.innerHTML = `
            <span class="font-semibold text-slate-700 dark:text-slate-300">${topic}</span>
            <span class="font-bold ${pct >= 70 ? 'text-emerald-500' : 'text-amber-500'}">${pct}% (${stat.earned}/${stat.total} XP)</span>
        `;
        topicsContainer.appendChild(row);
    });

    document.getElementById('mock-results-modal').classList.remove('hidden');
    triggerFilterAction();
}

function exitMockInterview() {
    if (confirm("Are you sure you want to exit the active Mock Interview? Progress will be lost.")) {
        if (mockTimerInterval) clearInterval(mockTimerInterval);
        isMockMode = false;
        document.getElementById('mock-status-bar').classList.add('hidden');
        document.getElementById('mock-eval-bar').classList.add('hidden');
        document.getElementById('btn-answer').classList.remove('hidden');
        triggerFilterAction();
        showToast("Mock Interview cancelled", "info");
    }
}
