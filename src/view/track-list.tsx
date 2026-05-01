import { Label } from "@heroui/react/label";
import { useEffect, useRef, useState } from "react";

import type { Track, WavAsset } from "../model/project.js";
import type { RulerMark } from "../model/ruler-mark.js";
import { createWaveform, type Waveform } from "../model/waveform.js";
import { Ruler } from "./track-list/ruler.js";

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
    rulerMarks: readonly RulerMark[];
}

export const TrackList = ({ tracks, rulerMarks }: TrackListProps) => {
    return (
        <div className="grid w-full grid-cols-[160px_1fr] grid-rows-[20px_1fr]">
            <div className="col-start-2 h-8">
                <Ruler xScale={1} viewportX={0} marks={rulerMarks} />
            </div>
            <div className="sticky flex flex-col border-r">
                {Object.entries(tracks).map(([key, props]) => (
                    <TrackHead {...props} key={key} />
                ))}
            </div>
            <div>
                {Object.entries(tracks).map(([key, props]) => (
                    <TrackBody {...props} key={key} />
                ))}
            </div>
        </div>
    );
};
