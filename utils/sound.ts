import {Sound} from "@/app/market/[page]/page";
import {Howl} from "howler";
import path from "path";

const map = new Map<number, number>([
    [-12, 0.5],
    [-11, 0.525],
    [-10, 0.55],
    [-9, 0.6],
    [-8, 0.625],
    [-7, 0.65],
    [-6, 0.7],
    [-5, 0.75],
    [-4, 0.8],
    [-3, 0.85],
    [-2, 0.9],
    [-1, 0.95],
    [0, 1],
    [1, 1.05],
    [2, 1.125],
    [3, 1.2],
    [4, 1.25],
    [5, 1.35],
    [6, 1.425],
    [7, 1.5],
    [8, 1.6],
    [9, 1.7],
    [10, 1.8],
    [11, 1.9],
    [12, 2.0]
])

export const rateToPitch = (rate: number): number => {
    return map.get(rate) || 1;
}

export const pitchToRate = (pitch: number): number => {
    return Array.from(map.entries()).find(([_, v]) => v === pitch)?.[0] || 0;
}

export function getSoundName(sound: Sound): string {
    return sound.sound
        .replaceAll("/", ".")
        .replaceAll("\\", ".")
        .replace(".sounds.", "")
        .replace(".ogg", "");
}

export function getSoundPath(sound: Sound): string {
    const sep = path.sep;
    return sep + "sounds" + sep + sound.sound.replaceAll(".", sep) + ".ogg";
}

export async function playSound(sound: Sound): Promise<Howl> {
    const minPitch = sound.pitch.min;
    const maxPitch = sound.pitch.max;
    const minRate = pitchToRate(minPitch);
    const maxRate = pitchToRate(maxPitch);
    const rate = Math.random() * (maxRate - minRate) + minRate;
    const howl = new Howl({
        src: [sound.sound],
        volume: sound.volume,
        rate: Math.pow(2, rate / 12),
        html5: true,
    });
    if (sound.delay) {
        setTimeout(() => howl.play(), (sound.delay / 20) * 1000);
    } else {
        howl.play();
    }
    return howl;
}
