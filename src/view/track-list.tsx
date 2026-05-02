import { Label } from "@heroui/react/label";

import type { Track, WavAsset } from "../model/project.js";
import type { RulerMark } from "../model/ruler-mark.js";
import { Ruler } from "./track-list/ruler.js";
import { TrackBody } from "./track-list/track-body.js";

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

export interface TrackListProps {
    tracks: Record<Track, WavAsset>;
    rulerMarks: readonly RulerMark[];
}

export const TrackList = ({ tracks, rulerMarks }: TrackListProps) => {
    const isEmpty = Object.entries(tracks).length === 0;
    if (isEmpty) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <p className="text-center">Open Track menu to Add your assets</p>
            </div>
        );
    }
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
