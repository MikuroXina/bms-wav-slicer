import { parseMidiFile } from "@sightread/jasmid.ts";
import { produce } from "immer";

import type { SlicerAction } from "./action.js";
import type { SlicerProject, Track } from "./project.js";
import { fromMidiEvents } from "./ruler-mark.js";
import type { TickResolution } from "./time.js";

export function reducer(state: SlicerProject, action: SlicerAction): SlicerProject {
    if (action.type === "ADD_TRACK") {
        const id = Object.keys(state.assets).length.toString() as Track;
        return produce(state, (draft) => {
            draft.assets[id] = { id, file: action.audioFile };
        });
    }
    if (action.type === "IMPORT_MIDI") {
        const midi = parseMidiFile(action.midiFileArrayBuffer);
        const newResolution = midi.header.ticksPerBeat as TickResolution;
        const allEvents = midi.tracks.flat();
        const marks = fromMidiEvents(newResolution, allEvents);
        return produce(state, (draft) => {
            draft.resolution = newResolution;
            draft.rulerMarks = marks;
        });
    }
    if (action.type === "SET_QUANTIZE_TYPE") {
        return produce(state, (draft) => {
            draft.quantizeMode.type = action.newType;
        });
    }
    if (action.type === "TOGGLE_QUANTIZE_TRIPLET") {
        return produce(state, (draft) => {
            draft.quantizeMode.isTriplet = !draft.quantizeMode.isTriplet;
        });
    }
    if (action.type === "PREVIEW_HORIZONTAL_SCALE") {
        return produce(state, (draft) => {
            draft.xScale = action.newScale;
        });
    }
    if (action.type === "SET_HORIZONTAL_SCALE") {
        return produce(state, (draft) => {
            draft.xScale = action.newScale;
        });
    }
    throw new Error("todo");
}
