import type { SlicerProjectHistory } from "../model/history.js";
import type { HistoryRepository } from "../service/save.js";

const LOCAL_STORAGE_KEY = "BMS_WAV_SLICER_V1" as const;

function saveHistory(history: SlicerProjectHistory): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
}

function loadHistory(): SlicerProjectHistory {
    const historyEntry = localStorage.getItem(LOCAL_STORAGE_KEY);
    return historyEntry === null ? {} : (JSON.parse(historyEntry) as SlicerProjectHistory);
}

export const localStorageRepo: HistoryRepository = {
    saveHistory,
    loadHistory,
};
