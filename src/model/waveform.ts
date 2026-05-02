export interface Waveform {
    polygon(secondsFrom: number, secondsTo: number): Promise<AudioBuffer>;
}

const sampleRate = 48000;

export async function createWaveform(file: File): Promise<Waveform> {
    const audioData = await file.arrayBuffer();
    return {
        polygon: async (secondsFrom, secondsTo) => {
            const audioCtx = new OfflineAudioContext({
                numberOfChannels: 2,
                length: sampleRate * (secondsTo - secondsFrom),
                sampleRate,
            });
            const audioBuffer = await audioCtx.decodeAudioData(audioData.slice());
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);

            source.start(0, secondsFrom, secondsTo - secondsFrom);
            source.stop(secondsTo);
            return await audioCtx.startRendering();
        },
    };
}
