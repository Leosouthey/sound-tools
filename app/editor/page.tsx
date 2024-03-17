"use client";

import {useSoundsStore} from "@/providers/sounds-store-provider";
import {Button} from "@nextui-org/react";

export default function Editor() {
    const {sounds} = useSoundsStore((state) => state)

    const exportProject = () => {
        const data = JSON.stringify(sounds, null, 2);
        const blob = new Blob([data], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "project.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex gap-2">
                <Button>导入工程文件</Button>
                <Button onClick={exportProject}>导出工程文件</Button>
            </div>
            <div className="flex flex-col gap-2">
                {sounds.map((sound) => (
                    <audio key={sound.sound} src={sound.sound} controls/>
                ))}
            </div>
        </div>
    );
}
