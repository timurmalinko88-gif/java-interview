import { state, loadPersistence } from './state.js';
import { buildSidebarList, loadQuestion, updateStatsUI } from './ui.js';

export async function fetchQuestions() {
    try {
        // Try fetching index.json dynamically.
        const response = await fetch('index.json');
        if (!response.ok) throw new Error("Index file not found");
        const data = await response.json();
        
        if (data && data.questions && data.questions.length > 0) {
            state.questionsList = data.questions;
        } else {
            state.questionsList = [...state.fallbackDatabase];
        }

        // Merge custom questions from localStorage if present
        try {
            const customQuestions = JSON.parse(localStorage.getItem('java_trainer_custom_questions') || '[]');
            if (Array.isArray(customQuestions) && customQuestions.length > 0) {
                customQuestions.forEach(cq => {
                    if (!state.questionsList.some(q => q.id === cq.id)) {
                        state.questionsList.push(cq);
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to load custom questions from localStorage', e);
        }
    } catch (err) {
        console.log("Using rich embedded fallback database.");
        state.questionsList = [...state.fallbackDatabase];
    }

    state.filteredQuestions = [...state.questionsList];
    loadPersistence();
    updateStatsUI(); // Initialize XP and Rank
    buildSidebarList();
    if (typeof window.renderAlgoListGlobal === 'function') {
        window.renderAlgoListGlobal();
    }
    let initialIndex = 0;
    const hash = window.location.hash;
    if (hash && hash.startsWith('#q=')) {
        const targetId = hash.replace('#q=', '').trim();
        const foundIndex = state.filteredQuestions.findIndex(q => q.id === targetId);
        if (foundIndex !== -1) {
            initialIndex = foundIndex;
        }
    }
    state.currentIndex = initialIndex;
    await loadQuestion(initialIndex);
}

export async function fetchQuestionContent(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Failed to fetch question at ${path}`);
    }
    return await response.text();
}
