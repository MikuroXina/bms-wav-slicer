import { Label } from "@heroui/react/label";
import { useEffect, useRef, useState } from "react";

import type { Track, WavAsset } from "../model/project.js";
import { createWaveform, type Waveform } from "../model/waveform.js";

interface TrackHeadProps {
    id: string;
    file: File;
}

const TrackHead = ({ id, file }: TrackHeadProps) => {
    return (
        <div className="bg-overlay flex h-20 flex-col justify-evenly border-be">
            <div className="block truncate p-4">
                <Label>
                    {id.padStart(2, "0")} {file.name}
                </Label>
            </div>
        </div>
    );
};

interface TrackBodyProps {
    file: File;
}

const TrackBody = ({ file }: TrackBodyProps) => {
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

export interface TrackListProps {
    tracks: Record<Track, WavAsset>;
}

export const TrackList = ({ tracks }: TrackListProps) => {
    return (
        <div className="flex h-auto w-full">
            <div className="sticky flex h-auto w-40 flex-col border-r">
                {Object.entries(tracks).map(([key, props]) => (
                    <TrackHead {...props} key={key} />
                ))}
            </div>
            <div className="w-full">
                {Object.entries(tracks).map(([key, props]) => (
                    <TrackBody {...props} key={key} />
                ))}
            </div>
        </div>
    );
};
