import type { SlicerAction } from "./action.js";
import type { TickResolution } from "./time.js";

declare const trackBrand: unique symbol;
export type Track = string & { [trackBrand]: never };

export interface WavAsset {
    id: Track;
    file: File;
}

export interface SlicerProject {
    readonly resolution: TickResolution;
    readonly assets: Record<Track, WavAsset>;
    readonly undoStack: readonly SlicerAction[];
}

export const initialSlicerProject: SlicerProject = {
    resolution: 240 as TickResolution,
    assets: {},
    undoStack: [],
};
