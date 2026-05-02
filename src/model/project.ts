import type { SlicerAction } from "./action.js";
import type { RulerMark } from "./ruler-mark.js";
import type { MicroSecond, Tempo, TickResolution } from "./time.js";

declare const trackBrand: unique symbol;
export type Track = string & { [trackBrand]: never };

export interface WavAsset {
    id: Track;
    file: File;
}

export interface SlicerProject {
    readonly resolution: TickResolution;
    readonly assets: Record<Track, WavAsset>;
    readonly rulerMarks: readonly RulerMark[];
    readonly undoStack: readonly SlicerAction[];
}

export const initialSlicerProject: SlicerProject = {
    resolution: 240 as TickResolution,
    assets: {},
    rulerMarks: [
        {
            type: "TEMPO_CHANGE",
            at: 0 as MicroSecond,
            tempo: 500000 as Tempo,
        },
        ...[...new Array(10)].map((_, i) => ({
            type: (i % 4 === 0 ? "SECTION_LINE" : "BEAT_LINE") as "SECTION_LINE" | "BEAT_LINE",
            at: (i * 500000) as MicroSecond,
        })),
    ],
    undoStack: [],
};
