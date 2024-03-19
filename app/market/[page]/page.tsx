import {redirect} from "next/navigation";
import {Sounds} from "@/components/Sounds";
import {SearchStoreProvider} from "@/providers/search-store-provider";
import * as fs from "fs";
import path from "path";

export type Sound = {
    sound: string;
    volume: number;
    pitch: {
        min: number;
        max: number;
    };
    delay: number;
};

export type ListJSON = {
    directories: string[];
    files: string[];
};

export default function Market({params}: { params: { page: string } }) {
    const page = Number(params.page);
    (page === undefined || page < 1) && redirect("/market/1");

    return (
        <SearchStoreProvider>
            <div className="flex flex-col gap-16 items-center justify-center">
                <Sounds page={page} allSounds={allSounds}/>
            </div>
        </SearchStoreProvider>
    );
}

function getAudioFiles(dir: string, sounds: Sound[] = []): Sound[] {
    const file = fs.readFileSync(path.join(dir, "_list.json"), "utf-8");
    const list = JSON.parse(file) as ListJSON;
    const directories = list.directories;
    const soundsFromListJson = list.files;
    sounds.push(
        ...soundsFromListJson.map((sound) => ({
            sound: path
                .relative(process.cwd(), path.join(dir, sound))
                .replace("public", ""),
            volume: 1,
            pitch: {
                min: 1,
                max: 1,
            },
            delay: 0,
        }))
    );
    directories.forEach((directory) => {
        getAudioFiles(path.join(dir, directory), sounds);
    });
    return sounds;
}

const pwd = process.cwd();
const allSounds = getAudioFiles(path.join(pwd, "public", "sounds"));