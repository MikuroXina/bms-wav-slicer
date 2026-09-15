import { useReducer, useState, type JSX } from "react";

import { localStorageRepo } from "../adaptor/local-storage.js";
import { DispatchContext, type Dispatch } from "../model/action.js";
import { LoadingContext } from "../model/loading.js";
import { initialSlicerProject, type SlicerProject } from "../model/project.js";
import { reducer } from "../model/store.js";
import { saveProject } from "../service/save.js";
import { LoadingCover } from "./loading-cover.js";
import { MenuBar } from "./menu-bar.js";
import { Ribbon } from "./ribbon.js";
import { TrackList } from "./track-list.js";

const applyMiddlewares =
    (state: SlicerProject, dispatch: Dispatch): Dispatch =>
    (action) => {
        if (action.type === "SAVE") {
            saveProject(state, localStorageRepo);
        }
        dispatch(action);
    };

export const App = (): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialSlicerProject);
    const afterMiddleware = applyMiddlewares(state, dispatch);
    const [isLoading, setIsLoading] = useState(false);
    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            <DispatchContext.Provider value={afterMiddleware}>
                <main className="bg-background h-screen w-screen">
                    <MenuBar />
                    <Ribbon xScale={state.xScale} quantizeMode={state.quantizeMode} />
                    <TrackList
                        resolution={state.resolution}
                        quantizeMode={state.quantizeMode}
                        xScale={state.xScale}
                        tracks={state.assets}
                        rulerMarks={state.rulerMarks}
                        sliceMarks={state.sliceMarks}
                    />
                </main>
                {isLoading && <LoadingCover />}
            </DispatchContext.Provider>
        </LoadingContext.Provider>
    );
};
