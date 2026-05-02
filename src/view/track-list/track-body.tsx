import { useEffect, useRef, useState } from "react";

import { createWaveform, type Waveform } from "../../model/waveform.js";

const X_PER_SAMPLE = 2.5;

function smooth(array: Float32Array, stride: number): Float32Array {
    const peak = array.map((v) => v * v).reduce((a, b) => Math.max(a, b), 0);
    const ret = new Float32Array(Math.ceil(array.length / stride));
    if (peak < 1e-8) {
        return ret;
    }

    for (let i = 0; i < ret.length; ++i) {
        let sum = 0;
        for (let j = 0; j < stride; ++j) {
            if (i + j < array.length) {
                sum += array[i * stride + j]! ** 2 / peak;
            }
        }
        ret[i] = sum / stride;
    }
    return ret;
}

export interface TrackBodyProps {
    file: File;
    xScale: number;
}

export const TrackBody = ({ file, xScale }: TrackBodyProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sizeRef = useRef<[number, number] | null>(null);
    const [waveform, setWaveform] = useState<Waveform | null>(null);
    useEffect(() => {
        const aborter = new AbortController();
        createWaveform(file).then((wav) => {
            if (aborter.signal.aborted) {
                return;
            }
            setWaveform(wav);
        });
        return () => {
            aborter.abort();
        };
    }, [file]);
    useEffect(() => {
        if (canvasRef.current == null || waveform == null) {
            return;
        }

        const canvas = canvasRef.current;
        if (sizeRef.current == null) {
            const rect = canvas.getBoundingClientRect();
            sizeRef.current = [rect.width, rect.height];
        }
        const [width, height] = sizeRef.current;
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
        const ctx = canvas.getContext("2d");
        if (ctx == null) {
            return;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.scale(devicePixelRatio, devicePixelRatio);
        ctx.fillStyle = "black";
        waveform.polygon(0, 4).then((buf) => {
            const topChannel = smooth(buf.getChannelData(0), 1200);
            ctx.beginPath();
            ctx.moveTo(0, 0.5 * height);
            for (let i = 0; i < topChannel.length; ++i) {
                const sample = topChannel[i]!;
                ctx.lineTo(i * xScale * X_PER_SAMPLE, (0.5 - sample / 2) * height);
            }
            ctx.lineTo(topChannel.length - 1, 0.5 * height);
            ctx.closePath();
            ctx.fill();

            const bottomChannel = buf.getChannelData(1);
            ctx.beginPath();
            ctx.moveTo(0, 0.5 * height);
            for (let i = 0; i < bottomChannel.length; ++i) {
                const sample = topChannel[i]!;
                ctx.lineTo(i * xScale * X_PER_SAMPLE, (0.5 + sample / 2) * height);
            }
            ctx.lineTo(bottomChannel.length - 1, 0.5 * height);
            ctx.closePath();
            ctx.fill();
        });
    }, [waveform, xScale]);

    return <canvas ref={canvasRef} className="h-20 w-full"></canvas>;
};
