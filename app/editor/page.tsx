"use client";

import {Howl} from "howler";

import {useSoundsStore} from "@/providers/sounds-store-provider";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Slider,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import React, {useRef, useState} from "react";
import {chain} from "@react-aria/utils";
import {Sound} from "@/app/market/[page]/page";
import {Input} from "@nextui-org/input";
import {getSoundName, getSoundPath, pitchToRate, playSound, rateToPitch} from "@/utils/sound";

export default function Editor() {
    const {sounds, setSounds} = useSoundsStore((state) => state);
    const fileInput = useRef<HTMLInputElement>(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [sourceNodes, setSourceNodes] = React.useState<AudioBufferSourceNode[]>([]);

    const play = async () => {
        sourceNodes.forEach((sourceNode) => sourceNode.stop());
        setSourceNodes([]);
        for (const sound of sounds) {
            const sourceNode = await playSound(sound);
            setSourceNodes((prev) => [...prev, sourceNode]);
        }
    };

    const copyProject = () => {
        const json = sounds.map((sound) => {
            const temp = {...sound};
            temp.sound = getSoundName(temp);
            return temp;
        });
        const data = JSON.stringify(json, null, 2);
        // 复制到剪贴板
        const input = document.createElement('textarea');
        input.innerHTML = data;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('复制成功');
    };


    const exportProject = () => {
        const json = sounds.map((sound) => {
            const temp = {...sound};
            temp.sound = getSoundName(temp);
            return temp;
        });
        const data = JSON.stringify(json, null, 2);
        const blob = new Blob([data], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "project.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const importProject = () => {
        fileInput.current?.click();
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const json = JSON.parse(content);
                const importSounds = json.map((sound: Sound) => {
                    const temp = {...sound};
                    temp.sound = getSoundPath(temp);
                    return temp;
                });
                setSounds(importSounds);
            };
            reader.readAsText(file);
        }
    };

    const clearProject = () => {
        setSounds([]);
    };

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className="flex gap-2">
                <input
                    ref={fileInput}
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                />
                {sounds.length === 0 && (
                    <Button onClick={importProject}>导入工程文件</Button>
                )}
                {sounds.length !== 0 && (
                    <>
                        <Button onClick={copyProject}>复制工程文件</Button>
                        <Button onClick={exportProject}>导出工程文件</Button>
                        <Button color="danger" onClick={onOpen}>
                            清空工程
                        </Button>
                    </>
                )}
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    你真的不是误触了吗
                                </ModalHeader>
                                <ModalBody>
                                    <p>非删不可吗</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        关闭
                                    </Button>
                                    <Button onPress={chain(onClose, clearProject)}>确定</Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {sounds.map((sound, index) => (
                    <SoundEditCard key={index} sound={sound}/>
                ))}
            </div>
            {sounds.length !== 0 && (
                <div className="flex gap-2">
                    <Tooltip content="播放整体效果" color="foreground">
                        <Button isIconOnly onClick={play}>
                            <span className="icon-[line-md--play] size-5"/>
                        </Button>
                    </Tooltip>
                </div>
            )}
        </div>
    );
}

function SoundEditCard({sound}: { sound: Sound }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const soundName = getSoundName(sound);
    const {sounds, removeSound, setSounds} = useSoundsStore((state) => state);
    const [form, setForm] = useState<Sound>(sound);

    const play = () => {
        playSound(sound);
    };

    const saveSound = () => {
        setSounds(sounds.map((s) => (s === sound ? form : s)));
    };

    const changeRange = (value: number | number[]) => {
        if (typeof value === "number") {
            setForm({...form, pitch: {min: rateToPitch(value), max: rateToPitch(value)}});
        } else {
            setForm({...form, pitch: {min: rateToPitch(value[0]), max: rateToPitch(value[1])}});
        }
    };

    return (
        <div className="flex gap-4">
            <div>
                <Tooltip content="从编辑器中移除" color="foreground">
                    <Button isIconOnly onClick={() => removeSound(sound)}>
                        <span className="icon-[line-md--minus] size-5"/>
                    </Button>
                </Tooltip>
            </div>
            <div
                className="bg-zinc-800 p-2 rounded-lg w-56 cursor-pointer flex items-center justify-center hover:bg-zinc-900 transition-all duration-300">
                <Tooltip content={soundName} color="foreground">
                    <h2 className="truncate">{soundName}</h2>
                </Tooltip>
            </div>
            <div className="flex gap-2">
                <Tooltip content="试听音效" color="foreground">
                    <Button isIconOnly onClick={play}>
                        <span className="icon-[line-md--play] size-5"/>
                    </Button>
                </Tooltip>
                <Tooltip content="编辑 Meta" color="foreground">
                    <Button isIconOnly onClick={() => onOpen()}>
                        <span className="icon-[line-md--edit] size-5"/>
                    </Button>
                </Tooltip>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    编辑音效：{soundName}
                                </ModalHeader>
                                <ModalBody>
                                    <Input
                                        label="音量"
                                        type="text"
                                        defaultValue={form.volume.toString()}
                                        onChange={(e) =>
                                            setForm({...form, volume: Number(e.target.value)})
                                        }
                                    />
                                    <Slider
                                        label="音调"
                                        step={1}
                                        maxValue={12}
                                        minValue={-12}
                                        getValue={(value) => {
                                            if (typeof value === "number") {
                                                return `${value}`
                                            } else {
                                                return `${value[0]} ~ ${value[1]}`
                                            }
                                        }}
                                        defaultValue={[pitchToRate(form.pitch.min), pitchToRate(form.pitch.max)]}
                                        onChange={changeRange}
                                    />
                                    <Input
                                        label="延迟"
                                        type="text"
                                        defaultValue={form.delay.toString()}
                                        onChange={(e) =>
                                            setForm({...form, delay: Number(e.target.value)})
                                        }
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        关闭
                                    </Button>
                                    <Button onPress={chain(onClose, saveSound)}>确定</Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}
