import { useEffect, useRef } from "react";

import type { RulerMark } from "../../model/ruler-mark.js";

const WIDTH_PER_MS = 20 / 1000;

export interface RulerProps {
    xScale: number;
    viewportX: number;
    marks: readonly RulerMark[];
}

export const Ruler = ({ xScale, viewportX, marks }: RulerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sizeRef = useRef<[number, number] | null>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx == null) {
            return;
        }

        const canvas = canvasRef.current!;
        if (sizeRef.current == null) {
            const rect = canvas.getBoundingClientRect();
            sizeRef.current = [rect.width, rect.height];
        }

        const [width, height] = sizeRef.current;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;

        ctx.scale(devicePixelRatio, devicePixelRatio);

        ctx.strokeStyle = "#777";
        ctx.beginPath();
        let section = 1;
        for (const mark of marks) {
            const { at, type } = mark;
            const x = WIDTH_PER_MS * at;
            switch (type) {
                case "SECTION_LINE":
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                    ctx.font = `${Math.floor(0.4 * height)}px monospace`;
                    ctx.fillText(section.toString(), x + 1, 0.4 * height);
                    ++section;
                    break;
                case "BEAT_LINE":
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, 0.5 * height);
                    break;
                case "TEMPO_CHANGE":
                    ctx.font = `${Math.floor(0.5 * height)}px monospace`;
                    ctx.fillText(((60 * 1000) / mark.tempo).toFixed(2), x, height);
                    break;
            }
        }
        ctx.stroke();
    }, [xScale, viewportX]);

    return <canvas ref={canvasRef} className="h-full w-full"></canvas>;
};
