import { Label } from "@heroui/react/label";

import type { Track, WavAsset } from "../model/project.js";
import type { QuantizeMode } from "../model/quantize.js";
import type { RulerMark } from "../model/ruler-mark.js";
import type { SliceMark } from "../model/slice-mark.js";
import type { TickResolution } from "../model/time.js";
import { PlayerOverlay } from "./player-overlay.js";
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
    resolution: TickResolution;
    quantizeMode: QuantizeMode;
    xScale: number;
    tracks: Record<Track, WavAsset>;
    rulerMarks: readonly RulerMark[];
    sliceMarks: Record<Track, readonly SliceMark[]>;
}

export const TrackList = ({
    resolution,
    quantizeMode,
    xScale,
    tracks,
    rulerMarks,
    sliceMarks,
}: TrackListProps) => {
    const isEmpty = Object.entries(tracks).length === 0;
    if (isEmpty) {
        return (
            <div className="flex w-full items-center justify-center">
                <p className="text-center">Open Track menu to Add your assets</p>
            </div>
        );
    }
    return (
        <div className="grid w-full grid-cols-[160px_1fr] grid-rows-[2rem_1fr]">
            <div className="col-start-2 h-8">
                <Ruler xScale={xScale} viewportX={0} marks={rulerMarks} />
            </div>
            <div className="sticky flex flex-col border-r">
                {Object.entries(tracks).map(([key, props]) => (
                    <TrackHead {...props} key={key} />
                ))}
            </div>
            <div className="relative">
                {Object.entries(tracks).map(([key, props]) => (
                    <TrackBody
                        {...props}
                        xScale={xScale}
                        sliceMarks={sliceMarks[key as Track] ?? []}
                        key={key}
                    />
                ))}
                <PlayerOverlay
                    resolution={resolution}
                    quantizeMode={quantizeMode}
                    xScale={xScale}
                    sectionLines={rulerMarks.filter((mark) => mark.type === "SECTION_LINE")}
                    tempoChanges={rulerMarks.filter((mark) => mark.type === "TEMPO_CHANGE")}
                />
            </div>
        </div>
    );
};
