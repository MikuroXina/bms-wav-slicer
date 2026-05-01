declare const tickResolutionBrand: unique symbol;
/**
 * Global scope ticks per beat.
 */
export type TickResolution = number & { [tickResolutionBrand]: never };

declare const tempoBrand: unique symbol;
/**
 * Local scope micro-seconds per beat.
 */
export type Tempo = number & { [tempoBrand]: never };

declare const musicTickBrand: unique symbol;
/**
 * Absolute tick count from the start of music.
 */
export type MusicTick = number & { [musicTickBrand]: never };

declare const microSecondBrand: unique symbol;
export type MicroSecond = number & { [microSecondBrand]: never };
