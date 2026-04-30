import { Label } from "@heroui/react/label";

import type { Track, WavAsset } from "../model/project.js";

interface TrackRowProps {
    id: number;
    name: string;
    data: unknown;
}

const TrackRow = ({ id, name }: TrackRowProps) => {
    return (
        <div className="flex h-20 border-be">
            <div className="bg-overlay flex w-40 flex-col justify-evenly border-r p-2">
                <div className="block truncate">
                    <Label>
                        {id.toString().padStart(2, "0")} {name}
                    </Label>
                </div>
            </div>
            <div>Track Area</div>
        </div>
    );
};

export interface TrackListProps {
    tracks: Record<Track, WavAsset>;
}

export const TrackList = ({ tracks }: TrackListProps) => {
    return (
        <div className="flex h-full w-full flex-col">
            {Object.entries(tracks).map(([key, props]) => (
                <TrackRow {...props} key={key} />
            ))}
        </div>
    );
};
