import type { SlicerProject, Track } from "./project.js";

export const LOCAL_STORAGE_KEY = "BMS_WAV_SLICER_V1" as const;

declare const isoDateStringBrand: unique symbol;
export type IsoDateString = string & { [isoDateStringBrand]: never };

export const isoStringFromDate = (date: Date): IsoDateString => date.toISOString() as IsoDateString;
export const isoStringToDate = (str: IsoDateString): Date => new Date(str);

export interface FrozenSlicerProject extends Omit<SlicerProject, "assets"> {
    assets: Record<Track, string>;
}

export function freeze(project: SlicerProject): FrozenSlicerProject {
    return {
        ...project,
        assets: Object.fromEntries(
            Object.entries(project.assets).map(([key, value]) => [key, value.file.name]),
        ),
    };
}

export type SlicerProjectHistory = Record<IsoDateString, FrozenSlicerProject>;
