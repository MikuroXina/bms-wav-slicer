import { useEffect, useRef, useState } from "react";

import { createWaveform, type Waveform } from "../../model/waveform.js";

export interface TrackBodyProps {
    file: File;
}

export const TrackBody = ({ file }: TrackBodyProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
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

    return <canvas ref={canvasRef} className="h-20 w-full"></canvas>;
};
