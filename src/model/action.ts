import { createContext, useContext } from "react";

export type SlicerAction =
    | { type: "IMPORT_MIDI"; midiFileArrayBuffer: ArrayBuffer }
    | { type: "ADD_TRACK"; audioFile: File };

export type Dispatch = (action: SlicerAction) => void;

export const DispatchContext = createContext<Dispatch>(() => {
    console.warn("DispatchContext not provided");
});

export const useDispatch = (): Dispatch => useContext(DispatchContext);
