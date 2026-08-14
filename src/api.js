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
