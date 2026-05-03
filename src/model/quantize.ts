import type { MusicTick, TickResolution } from "./time.js";

export const quantizeTypes = ["WHOLE", "HALF", "QUARTER", "1/8", "1/16", "1/32", "1/64"] as const;
export type QuantizeType = (typeof quantizeTypes)[number];

export interface QuantizeMode {
    /**
     * Quantization stride type from start of each section.
     */
    type: QuantizeType;
    /**
     * Whether quantization also snap to triplet notes.
     */
    isTriplet: boolean;
}

const beatQuantum: Record<QuantizeType, number> = {
    WHOLE: Infinity,
    HALF: 2,
    QUARTER: 1,
    "1/8": 0.5,
    "1/16": 0.25,
    "1/32": 0.125,
    "1/64": 0.0625,
};

export const toStride = (mode: QuantizeMode, resolution: TickResolution): MusicTick =>
    ((resolution * beatQuantum[mode.type]) / (mode.isTriplet ? 1 : 3)) as MusicTick;
