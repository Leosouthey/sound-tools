import {Sound} from "@/app/market/[[...path]]/page";
import {Howl} from "howler";

export function getSoundName(sound: Sound): string {
    return sound.sound.replaceAll("/", ".").replace(".sounds.", "").replace(".ogg", "");
}

export function getSoundPath(sound: Sound): string {
    return "/sounds/" + sound.sound.replaceAll(".", "/") + ".ogg";
}

export async function playSound(sound: Sound): Promise<Howl> {
    const rate = Math.random() * ((sound.pitch?.max || 0) - (sound.pitch?.min || 0)) + (sound.pitch?.min || 0);
    const howl = new Howl({
        src: [sound.sound],
        volume: sound.volume || 1,
        rate: rate,
        html5: true,
    });
    if (sound.delay) {
        setTimeout(() => howl.play(), sound.delay / 20 * 1000);
    } else {
        howl.play();
    }
    return howl;
}