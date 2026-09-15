import { freeze, isoStringFromDate, type SlicerProjectHistory } from "../model/history.js";
import type { SlicerProject } from "../model/project.js";

export interface HistoryRepository {
    loadHistory: () => SlicerProjectHistory;
    saveHistory: (history: SlicerProjectHistory) => void;
}

export function saveProject(project: SlicerProject, repo: HistoryRepository): void {
    const history = repo.loadHistory();
    const newHistory = {
        ...history,
        [isoStringFromDate(new Date())]: freeze(project),
    } satisfies SlicerProjectHistory;
    repo.saveHistory(newHistory);
}
