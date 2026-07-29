import { state, savePersistence } from './state.js';
import { syncActionButtons, buildSidebarList, showToast } from './ui.js';

export function isFlagged(questionId) {
    if (!state.flaggedIds) return false;
    if (Array.isArray(state.flaggedIds)) {
        return state.flaggedIds.includes(questionId);
    }
    if (typeof state.flaggedIds === 'object') {
        return Object.values(state.flaggedIds).some(folder => 
            Array.isArray(folder) ? folder.includes(questionId) : folder === questionId
        );
    }
    return false;
}

export function toggleFlag(questionId, folderName = "Favorites") {
    if (!state.flaggedIds) state.flaggedIds = {};
    if (!state.flaggedIds[folderName]) {
        state.flaggedIds[folderName] = [];
    }

    let isRemoved = false;
    // Check if it exists anywhere and remove it if it does
    for (const folder in state.flaggedIds) {
        const index = state.flaggedIds[folder].indexOf(questionId);
        if (index > -1) {
            state.flaggedIds[folder].splice(index, 1);
            isRemoved = true;
        }
    }

    if (isRemoved) {
        showToast("Removed from bookmarks", "info");
    } else {
        state.flaggedIds[folderName].push(questionId);
        showToast(`Added to ${folderName}!`, "bookmark");
    }

    savePersistence();
    syncActionButtons(questionId);
    buildSidebarList();
}

export function getFolders() {
    if (!state.flaggedIds) return ["Favorites"];
    return Object.keys(state.flaggedIds);
}

export function getFlaggedFoldersForQuestion(questionId) {
    const folders = [];
    if (!state.flaggedIds) return folders;
    for (const folder in state.flaggedIds) {
        if (state.flaggedIds[folder].includes(questionId)) {
            folders.push(folder);
        }
    }
    return folders;
}
