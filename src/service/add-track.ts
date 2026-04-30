import type { Dispatch } from "../model/action.js";

export function addTrack(dispatch: Dispatch) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".wav";

    fileInput.addEventListener("change", () => {
        const { files } = fileInput;
        if (files == null) {
            return;
        }

        const file = files.item(0);
        if (file == null) {
            return;
        }

        dispatch({
            type: "ADD_TRACK",
            audioFile: file,
        });
    });
    fileInput.click();
}
