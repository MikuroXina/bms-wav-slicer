import { produce } from "immer";

import type { SlicerAction } from "./action.js";
import type { SlicerProject, Track } from "./project.js";

export function reducer(state: SlicerProject, action: SlicerAction): SlicerProject {
    if (action.type === "ADD_TRACK") {
        const id = Object.keys(state.assets).length.toString() as Track;
        return produce(state, (draft) => {
            draft.assets[id] = { id, file: action.audioFile };
        });
    }
    throw new Error("todo");
}
