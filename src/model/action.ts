import { createContext, useContext } from "react";

import type { QuantizeType } from "./quantize.js";

export type SlicerAction =
    | { type: "IMPORT_MIDI"; midiFileArrayBuffer: ArrayBuffer }
    | { type: "ADD_TRACK"; audioFile: File }
    | { type: "SET_QUANTIZE_TYPE"; oldType: QuantizeType; newType: QuantizeType }
    | { type: "TOGGLE_QUANTIZE_TRIPLET" }
    | { type: "SET_HORIZONTAL_SCALE"; oldScale: number; newScale: number }
    | { type: "PREVIEW_HORIZONTAL_SCALE"; newScale: number };

export type Dispatch = (action: SlicerAction) => void;

export const DispatchContext = createContext<Dispatch>(() => {
    console.warn("DispatchContext not provided");
});

export const useDispatch = (): Dispatch => useContext(DispatchContext);
