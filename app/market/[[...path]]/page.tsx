import fs from "fs";
import path from "node:path";
import {BreadcrumbsCard, DirectoryCard, SoundCard} from "@/components/Card";

export type Sound = {
    sound: string;
    volume?: number;
    pitch?: {
        min?: number;
        max?: number;
    }
    delay?: number;
}

export type Directory = {
    name: string;
}

type ListJSON = {
    directories: string[];
    files: string[];
}

type SoundList = {
    sounds: Sound[];
    directories: Directory[];
}

function getAudioFiles(dir: string): SoundList {
    const list: ListJSON = JSON.parse(fs.readFileSync(path.join(dir, "_list.json"), "utf-8"));
    const soundList: SoundList = {sounds: [], directories: []};
    for (const file of list.files) {
        if (file.endsWith(".ogg")) {
            soundList.sounds.push({sound: path.relative(process.cwd(), path.join(dir, file)).replace("public", "")});
        }
    }
    for (const subdir of list.directories) {
        soundList.directories.push({name: subdir});
    }
    return soundList;
}

export default function Market({params}: { params: { path?: string[] } }) {
    const pwd = process.cwd();
    const soundList = getAudioFiles(path.join(pwd, "public", "sounds", ...params.path?.filter(Boolean) || []));
    const directories = soundList.directories;
    const sounds = soundList.sounds;
    return (
        <div className="flex flex-col gap-4">
            <BreadcrumbsCard/>
            {directories.length !== 0 &&
                <div className="flex flex-col gap-2">
                    {directories.map((dir) => <DirectoryCard key={dir.name} directory={dir}/>)}
                </div>
            }
            <div className="flex flex-col gap-2">
                {sounds.map((sound) => <SoundCard key={sound.sound} sound={sound}/>)}
            </div>
        </div>
    );
}