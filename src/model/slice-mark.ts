import type { Track } from "./project.js";
import type { MicroSecond } from "./time.js";

export interface SliceMark {
    at: MicroSecond;
    track: Track;
}
