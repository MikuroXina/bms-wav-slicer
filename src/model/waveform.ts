export interface Waveform {
    polygon(secondsFrom: number, secondsTo: number): Promise<AudioBuffer>;
}

const sampleRate = 48000;
const chunkSeconds = 5;

export async function createWaveform(file: File): Promise<Waveform> {
    const audioData = await file.arrayBuffer();
    const audioCtx = new OfflineAudioContext({
        numberOfChannels: 2,
        length: sampleRate * chunkSeconds,
        sampleRate,
    });
    const audioBuffer = await audioCtx.decodeAudioData(audioData);
    return {
        polygon: (secondsFrom, secondsTo) => {
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);

            source.start(0, secondsFrom, secondsTo - secondsFrom);
            source.stop(secondsTo);
            return audioCtx.startRendering();
        },
    };
}
