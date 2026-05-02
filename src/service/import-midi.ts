import { startTransition } from "react";

import type { Dispatch } from "../model/action.js";

export function importMidi(dispatch: Dispatch, setLoading: (newState: boolean) => void): void {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".mid";

    fileInput.addEventListener("change", () => {
        const { files } = fileInput;
        const file = files?.item(0);
        if (file == null) {
            return;
        }

        const promise = file.arrayBuffer();
        startTransition(() => {
            setLoading(true);
        });
        promise
            .then((buf) => {
                dispatch({
                    type: "IMPORT_MIDI",
                    midiFileArrayBuffer: buf,
                });
            }, console.error)
            .finally(() => {
                startTransition(() => {
                    setLoading(false);
                });
            });
    });
    fileInput.click();
}
