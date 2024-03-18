import {Sound} from "@/app/market/[page]/page";
import {Howl} from "howler";
import path from "path";

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
    const rate =
        Math.random() * ((sound.pitch?.max || 0) - (sound.pitch?.min || 0)) +
        (sound.pitch?.min || 0);
    const howl = new Howl({
        src: [sound.sound],
        volume: sound.volume || 1,
        rate: rate,
        html5: true,
    });
    if (sound.delay) {
        setTimeout(() => howl.play(), (sound.delay / 20) * 1000);
    } else {
        howl.play();
    }
    return howl;
}
