"use client";

import {usePathname} from "next/navigation";
import Link from "next/link";
import {Directory, Sound} from "@/app/market/[[...path]]/page";
import {Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Tooltip} from "@nextui-org/react";
import {useSoundsStore} from "@/providers/sounds-store-provider";
import {getSoundName, playSound} from "@/utils/sound";

export function DirectoryCard({directory}: { directory: Directory }) {
    const pathname = usePathname()
    return (
        <Link href={pathname + `/${directory.name}`}>
            <div
                className="bg-zinc-800 p-2 rounded-lg w-96 cursor-pointer flex items-center justify-center hover:bg-zinc-900 transition-all duration-300">
                <h2>{directory.name}</h2>
            </div>
        </Link>
    );
}

export function SoundCard({sound}: { sound: Sound }) {
    const soundName = getSoundName(sound);
    const {addSound} = useSoundsStore((state) => state)

    const copyToClipboard = () => {
        const temp = {...sound};
        temp.sound = getSoundName(temp);
        const json = JSON.stringify(temp, null, 2);
        navigator.clipboard.writeText(json);
    }

    const play = (rate: number) => () => {
        const soundWithRate = {...sound, pitch: {min: rate, max: rate}};
        playSound(soundWithRate);
    }

    return (
        <Accordion className="px-0" itemClasses={{
            title: "text-center",
            trigger: "bg-default h-[40px] p-2 rounded-lg w-96 flex items-center justify-center hover:bg-default-100 transition-all duration-300 cursor-pointer",
            indicator: "hidden"
        }}>
            <AccordionItem key={soundName} aria-label={soundName} title={soundName}>
                <div
                    className="w-96 flex items-center justify-between transition-all duration-300">
                    <Tooltip content="添加到编辑器" color="foreground">
                        <Button isIconOnly onClick={() => addSound(sound)}><span
                            className="icon-[line-md--plus] size-5"/></Button>
                    </Tooltip>
                    <Tooltip content="试听音调0" color="foreground">
                        <Button isIconOnly onClick={play(0)}><span className="icon-[line-md--play] size-5"/></Button>
                    </Tooltip>
                    <Tooltip content="试听音调1" color="foreground">
                        <Button isIconOnly onClick={play(1)}><span className="icon-[line-md--play] size-5"/></Button>
                    </Tooltip>
                    <Tooltip content="试听音调2" color="foreground">
                        <Button isIconOnly onClick={play(2)}><span className="icon-[line-md--play] size-5"/></Button>
                    </Tooltip>
                    <Tooltip content="复制音效 JSON 信息" color="foreground">
                        <Button isIconOnly onClick={copyToClipboard}><span
                            className="icon-[line-md--clipboard-arrow-twotone] size-5"/></Button>
                    </Tooltip>
                </div>
            </AccordionItem>
        </Accordion>
    );
}

export function BreadcrumbsCard() {
    const pathname = usePathname().replace("/market", "");
    return (
        <Breadcrumbs className="mb-2 bg-zinc-800 p-2 rounded-lg w-96">
            <BreadcrumbItem href="/market">广场</BreadcrumbItem>
            {pathname.split("/").filter(Boolean).map((path, index, array) => (
                <BreadcrumbItem key={path}
                                href={"/market/" + array.slice(0, index + 1).join("/")}>{path}</BreadcrumbItem>
            ))}
        </Breadcrumbs>
    );
}