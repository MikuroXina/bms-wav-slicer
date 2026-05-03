import { useEffect, useRef } from "react";

import { toStride, type QuantizeMode } from "../model/quantize.js";
import type { SectionLine } from "../model/ruler-mark.js";
import type { TickResolution } from "../model/time.js";

export interface PlayerOverlayProps {
    resolution: TickResolution;
    quantizeMode: QuantizeMode;
    sectionLines: readonly SectionLine[];
}

export const PlayerOverlay = ({ resolution, quantizeMode, sectionLines }: PlayerOverlayProps) => {
    const quantum = toStride(quantizeMode, resolution);
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
            markerRef.current.style.transform = `translateX(${markerX}px)`;
        };
        divRef.current.addEventListener("mousemove", onMouseMove);
        return () => {
            divRef.current?.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return (
        <div ref={divRef} className="absolute top-0 left-0 z-10 h-full w-full">
            <div ref={markerRef} className="border-accent h-full w-[1px] border-1" />
        </div>
    );
};
