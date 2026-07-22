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
    await loadQuestion(0);
}
