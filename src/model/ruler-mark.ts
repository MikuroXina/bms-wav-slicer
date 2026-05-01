import type { MidiEvent } from "@sightread/jasmid.ts";

import type { MicroSecond, Tempo, TickResolution } from "./time.js";

export interface SectionLine {
    type: "SECTION_LINE";
    at: MicroSecond;
}

export interface BeatLine {
    type: "BEAT_LINE";
    at: MicroSecond;
}

export interface TempoChange {
    type: "TEMPO_CHANGE";
    at: MicroSecond;
    tempo: Tempo;
}

export type RulerMark = SectionLine | BeatLine | TempoChange;

export function fromMidiEvents(
    resolution: TickResolution,
    events: readonly MidiEvent[],
): RulerMark[] {
    /** micro-seconds per quarter beat */
    let tempo = 500;
    /** quarter beats per section */
    let sectionLen = 4;
    let currentMs = 0;
    const ret: RulerMark[] = [];
    for (const event of events) {
        if (event.type === "meta" && event.subType === "setTempo") {
            ret.push({
                type: "TEMPO_CHANGE",
                at: currentMs as MicroSecond,
                tempo: event.microsecondsPerBeat as Tempo,
            });
        }
        const deltaMs = (tempo * event.deltaTime) / resolution;
        for (let i = 0; i * tempo < deltaMs; ++i) {
            const offset = i * tempo;
            ret.push({
                type: i % sectionLen === 0 ? "SECTION_LINE" : "BEAT_LINE",
                at: (currentMs + offset) as MicroSecond,
            });
        }
        currentMs += deltaMs;
        if (event.type === "meta") {
            if (event.subType === "setTempo") {
                tempo = event.microsecondsPerBeat;
            }
            if (event.subType === "timeSignature") {
                sectionLen = (4 * event.numerator) / event.denominator;
            }
        }
    }
    return ret;
}
