import type { SlicerAction } from "./action.js";
import type { SlicerProject } from "./project.js";

export function reducer(state: SlicerProject, action: SlicerAction): SlicerProject {
    if (action.type === "ADD_TRACK") {
        const id = Object.keys(state.assets).length.toString();
        return {
            ...state,
            assets: {
                ...state.assets,
                [id]: {
                    id,
                    name: action.audioFile.name,
                    data: () => action.audioFile.arrayBuffer(),
                },
            },
        };
    }
    throw new Error("todo");
}
