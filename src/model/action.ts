import { createContext, useContext } from "react";

import type { Track } from "./project.js";
import type { QuantizeType } from "./quantize.js";
import type { MicroSecond } from "./time.js";

export type SlicerAction =
    | { type: "IMPORT_MIDI"; midiFileArrayBuffer: ArrayBuffer }
    | { type: "ADD_TRACK"; audioFile: File }
    | { type: "SET_QUANTIZE_TYPE"; oldType: QuantizeType; newType: QuantizeType }
    | { type: "TOGGLE_QUANTIZE_TRIPLET" }
    | { type: "SET_HORIZONTAL_SCALE"; oldScale: number; newScale: number }
    | { type: "PREVIEW_HORIZONTAL_SCALE"; newScale: number }
    | { type: "TOGGLE_SLICE_MARK"; at: MicroSecond; track: Track };

export type Dispatch = (action: SlicerAction) => void;

export const DispatchContext = createContext<Dispatch>(() => {
    console.warn("DispatchContext not provided");
});

export const useDispatch = (): Dispatch => useContext(DispatchContext);
