import {
    freeze,
    isoStringFromDate,
    LOCAL_STORAGE_KEY,
    type SlicerProjectHistory,
} from "../model/history.js";
import type { SlicerProject } from "../model/project.js";

export function saveProject(project: SlicerProject): void {
    const historyEntry = localStorage.getItem(LOCAL_STORAGE_KEY);
    const history = historyEntry === null ? {} : (JSON.parse(historyEntry) as SlicerProjectHistory);
    const newHistory = {
        ...history,
        [isoStringFromDate(new Date())]: freeze(project),
    } satisfies SlicerProjectHistory;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
}
