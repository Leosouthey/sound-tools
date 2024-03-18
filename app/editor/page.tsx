"use client";

import {Howl} from 'howler';

import {useSoundsStore} from "@/providers/sounds-store-provider";
import {
    Accordion,
    AccordionItem,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip,
    useDisclosure
} from "@nextui-org/react";
import React, {useRef, useState} from "react";
import {chain} from "@react-aria/utils";
import {Sound} from "@/app/market/[[...path]]/page";
import {Input} from "@nextui-org/input";
import {getSoundName, getSoundPath, playSound} from "@/utils/sound";

export default function Editor() {
    const {sounds, setSounds} = useSoundsStore((state) => state)
    const fileInput = useRef<HTMLInputElement>(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [howls, setHowls] = React.useState<Howl[]>([]);

    const play = async () => {
        howls.forEach((howl) => howl.stop());
        setHowls([]);
        for (const sound of sounds) {
            const howl = await playSound(sound);
            setHowls((prev) => [...prev, howl]);
        }
    }

    const exportProject = () => {
        const json = sounds.map((sound) => {
            const temp = {...sound};
            temp.sound = getSoundName(temp);
            return temp;
        })
        const data = JSON.stringify(json, null, 2);
        const blob = new Blob([data], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "project.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    const importProject = () => {
        fileInput.current?.click();
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const json = JSON.parse(content)
                const importSounds = json.map((sound: Sound) => {
                    const temp = {...sound};
                    temp.sound = getSoundPath(temp);
                    return temp;
                });
                setSounds(importSounds);
            }
            reader.readAsText(file);
        }
    }

    const clearProject = () => {
        setSounds([]);
    }

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className="flex gap-2">
                <input ref={fileInput} type="file" className="hidden" onChange={handleFileInput}/>
                {sounds.length === 0 && <Button onClick={importProject}>导入工程文件</Button>}
                {sounds.length !== 0 &&
                    <>
                        <Button onClick={exportProject}>导出工程文件</Button>
                        <Button color="danger" onClick={onOpen}>清空工程</Button>
                    </>
                }
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
                    <ModalContent>
                        {(onClose) => <>
                            <ModalHeader className="flex flex-col gap-1">你真的不是误触了吗</ModalHeader>
                            <ModalBody><p>非删不可吗</p></ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    关闭
                                </Button>
                                <Button onPress={chain(onClose, clearProject)}>
                                    确定
                                </Button>
                            </ModalFooter>
                        </>}
                    </ModalContent>
                </Modal>
            </div>
            <div className="flex flex-col gap-2">
                {sounds.map((sound, index) => <SoundEditCard key={index} sound={sound}/>)}
            </div>
            {
                sounds.length !== 0 &&
                <div className="flex gap-2">
                    <Tooltip content="播放整体效果" color="foreground">
                        <Button isIconOnly onClick={play}><span className="icon-[line-md--play] size-5"/></Button>
                    </Tooltip>
                </div>
            }
        </div>
    );
}

function SoundEditCard({sound}: { sound: Sound }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const soundName = getSoundName(sound);
    const {sounds, removeSound, setSounds} = useSoundsStore((state) => state)
    const [form, setForm] = useState<Sound>(sound);

    const copyToClipboard = () => {
        const temp = {...sound};
        temp.sound = getSoundName(temp);
        const json = JSON.stringify(temp, null, 2);
        navigator.clipboard.writeText(json);
    }

    const play = () => {
        playSound(sound);
    }

    const saveSound = () => {
        setSounds(sounds.map((s) => s === sound ? form : s));
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
                    <Tooltip content="从编辑器中移除" color="foreground">
                        <Button isIconOnly onClick={() => removeSound(sound)}><span
                            className="icon-[line-md--minus] size-5"/></Button>
                    </Tooltip>
                    <Tooltip content="编辑 Meta" color="foreground">
                        <Button isIconOnly onClick={() => onOpen()}><span
                            className="icon-[line-md--edit] size-5"/></Button>
                    </Tooltip>
                    <Tooltip content="试听音效" color="foreground">
                        <Button isIconOnly onClick={play}><span className="icon-[line-md--play] size-5"/></Button>
                    </Tooltip>
                    <Tooltip content="复制音效 JSON 信息" color="foreground">
                        <Button isIconOnly onClick={copyToClipboard}><span
                            className="icon-[line-md--clipboard-arrow-twotone] size-5"/></Button>
                    </Tooltip>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">编辑音效：{soundName}</ModalHeader>
                                    <ModalBody>
                                        <Input
                                            label="音量"
                                            type="text"
                                            {...(form.volume && {defaultValue: form.volume.toString()})}
                                            onChange={(e) => setForm({...form, volume: Number(e.target.value)})}
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                label="音速最小值"
                                                type="text"
                                                {...(form.pitch?.min && {defaultValue: form.pitch.min.toString()})}
                                                onChange={(e) => setForm({
                                                    ...form,
                                                    pitch: {...form.pitch, min: Number(e.target.value)}
                                                })}
                                            />
                                            <Input
                                                label="音速最大值"
                                                type="text"
                                                {...(form.pitch?.max && {defaultValue: form.pitch.max.toString()})}
                                                onChange={(e) => setForm({
                                                    ...form,
                                                    pitch: {...form.pitch, max: Number(e.target.value)}
                                                })}
                                            />
                                        </div>
                                        <Input
                                            label="延迟"
                                            type="text"
                                            {...(form.delay && {defaultValue: form.delay.toString()})}
                                            onChange={(e) => setForm({...form, delay: Number(e.target.value)})}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            关闭
                                        </Button>
                                        <Button onPress={chain(onClose, saveSound)}>
                                            确定
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </AccordionItem>
        </Accordion>
    );
}
