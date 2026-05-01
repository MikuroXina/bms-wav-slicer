import { useReducer, type JSX } from "react";

import { DispatchContext } from "../model/action.js";
import { initialSlicerProject } from "../model/project.js";
import { reducer } from "../model/store.js";
import { MenuBar } from "./menu-bar.js";
import { TrackList } from "./track-list.js";

export const App = (): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialSlicerProject);
    return (
        <DispatchContext.Provider value={dispatch}>
            <main className="bg-background h-screen w-screen">
                <MenuBar />
                <TrackList tracks={state.assets} rulerMarks={state.rulerMarks} />
            </main>
        </DispatchContext.Provider>
    );
};
