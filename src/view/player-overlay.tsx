import React, { useEffect, useRef } from "react";

import { useDispatch } from "../model/action.js";
import type { Track } from "../model/project.js";
import { toStride, type QuantizeMode } from "../model/quantize.js";
import type { SectionLine, TempoChange } from "../model/ruler-mark.js";
import type { MicroSecond, Tempo, TickResolution } from "../model/time.js";
import { MICROSECOND_PER_X, X_PER_SAMPLE } from "./track-list/waveform-def.js";

function findNearest(microSeconds: MicroSecond, sectionLines: readonly SectionLine[]): SectionLine {
    // search item that minimizes distance by ternary search method in O(log N)
    const distance = (item: MicroSecond) => Math.abs(microSeconds - item);
    let start = 0;
    let end = sectionLines.length - 1;
    // the solution in [start, end]
    while (start + 2 < end) {
        const midLow = Math.floor((start * 2 + end) / 3);
        const midHigh = Math.floor((start + end * 2) / 3);
        if (distance(sectionLines[midLow]!.at) < distance(sectionLines[midHigh]!.at)) {
            end = midHigh;
        } else {
            start = midLow;
        }
    }

    let minDistance = Infinity;
    let minIndex = start;
    for (let i = start; i <= end; ++i) {
        const dist = distance(sectionLines[i]!.at);
        if (dist < minDistance) {
            minDistance = dist;
            minIndex = i;
        }
    }
    return sectionLines[minIndex]!;
}

function findTempoAt(microSeconds: MicroSecond, tempoChanges: readonly TempoChange[]): Tempo {
    // search item where latest until `microSeconds` by binary search method in O(log N)
    let start = 0;
    let end = tempoChanges.length;
    // the solution is in [start, end)
    while (start + 1 < end) {
        const mid = start + Math.floor((end - start) / 2);
        if (tempoChanges[mid]!.at <= microSeconds) {
            start = mid;
        } else {
            end = mid;
        }
    }
    return tempoChanges[start]!.tempo;
}

export interface PlayerOverlayProps {
    resolution: TickResolution;
    quantizeMode: QuantizeMode;
    xScale: number;
    sectionLines: readonly SectionLine[];
    tempoChanges: readonly TempoChange[];
}

export const PlayerOverlay = ({
    resolution,
    quantizeMode,
    xScale,
    sectionLines,
    tempoChanges,
}: PlayerOverlayProps) => {
    const dispatch = useDispatch();
    const divRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (divRef.current == null) {
            return;
        }

        const left = divRef.current.getBoundingClientRect().left;
        const onMouseMove = (e: MouseEvent) => {
            if (markerRef.current == null) {
                return;
            }

            const markerX = e.clientX - left;

            const markerMs = ((markerX * MICROSECOND_PER_X) / xScale) as MicroSecond;
            const nearestSection = findNearest(markerMs, sectionLines);
            const nearestSectionX = (nearestSection.at * xScale) / MICROSECOND_PER_X;

            const tempo = findTempoAt(markerMs, tempoChanges);
            const quantum = toStride(quantizeMode, resolution);
            const strideX = (quantum * tempo * xScale) / resolution / MICROSECOND_PER_X;
            const snapX =
                Math.round((markerX - nearestSectionX) / strideX) * strideX + nearestSectionX;
            markerRef.current.style.transform = `translateX(${snapX}px)`;
        };
        divRef.current.addEventListener("mousemove", onMouseMove);
        return () => {
            divRef.current?.removeEventListener("mousemove", onMouseMove);
        };
    }, [resolution, quantizeMode, sectionLines, tempoChanges]);

    function onClickWaveform(e: React.MouseEvent) {
        if (divRef.current == null) {
            return;
        }

        const { left } = divRef.current.getBoundingClientRect();
        const clickMs = (((e.clientX - left) * MICROSECOND_PER_X) / xScale) as MicroSecond;
        const nearestSection = findNearest(clickMs, sectionLines);
        const tempo = findTempoAt(clickMs, tempoChanges);
        const quantum = toStride(quantizeMode, resolution);
        const quantumMs = (quantum * tempo * xScale) / resolution;
        const snapMs = (Math.round((clickMs - nearestSection.at) / quantumMs) * quantumMs +
            nearestSection.at) as MicroSecond;
        dispatch({
            type: "TOGGLE_SLICE_MARK",
            at: snapMs,
            track: "0" as Track,
        });
    }

    return (
        <div
            onClick={onClickWaveform}
            ref={divRef}
            className="absolute top-0 left-0 z-10 h-full w-full"
        >
            <div ref={markerRef} className="border-accent h-full w-[1px] border-1" />
        </div>
    );
};
