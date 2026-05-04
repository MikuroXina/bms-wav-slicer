import { parseMidiFile } from "@sightread/jasmid.ts";
import { produce } from "immer";

import type { SlicerAction } from "./action.js";
import type { SlicerProject, Track } from "./project.js";
import { fromMidiEvents } from "./ruler-mark.js";
import type { SliceMark } from "./slice-mark.js";
import type { MicroSecond, TickResolution } from "./time.js";

function findSliceMark(
    marks: readonly SliceMark[],
    at: MicroSecond,
): { op: "INSERT"; index: number } | { op: "REMOVE"; index: number } {
    let start = 0;
    let end = marks.length;
    // the solution is in [start, end)
    while (start + 1 < end) {
        const mid = start + Math.floor((end - start) / 2);
        if (at < marks[mid]!.at) {
            end = mid;
        } else {
            start = mid;
        }
    }
    return marks[start]?.at === at
        ? {
              op: "REMOVE",
              index: start,
          }
        : {
              op: "INSERT",
              index: start + 1,
          };
}

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
    if (action.type === "TOGGLE_SLICE_MARK") {
        const entry = findSliceMark(state.sliceMarks[action.track] ?? [], action.at);
        return produce(state, (draft) => {
            if (entry.op === "REMOVE") {
                draft.sliceMarks[action.track]!.splice(entry.index, 1);
            } else {
                if (!(action.track in draft.sliceMarks)) {
                    draft.sliceMarks[action.track] = [];
                }
                draft.sliceMarks[action.track]!.splice(entry.index, 0, {
                    track: action.track,
                    at: action.at,
                });
            }
        });
    }
    throw new Error("todo");
}
