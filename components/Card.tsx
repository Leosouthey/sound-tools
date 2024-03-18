"use client";

import { Sound } from "@/app/market/[page]/page";
import {
  Button,
  Tooltip,
} from "@nextui-org/react";
import { useSoundsStore } from "@/providers/sounds-store-provider";
import { getSoundName, playSound } from "@/utils/sound";

export function SoundCard({ sound }: { sound: Sound }) {
  const soundName = getSoundName(sound);
  const { addSound } = useSoundsStore((state) => state);

  const play = (rate: number) => () => {
    const soundWithRate = { ...sound, pitch: { min: rate, max: rate } };
    playSound(soundWithRate);
  };

  return (
    <div className="flex gap-4">
      <div>
        <Tooltip content="添加到编辑器" color="foreground">
          <Button isIconOnly onClick={() => addSound(sound)}>
            <span className="icon-[line-md--plus] size-5" />
          </Button>
        </Tooltip>
      </div>
      <div className="bg-zinc-800 p-2 rounded-lg w-56 cursor-pointer flex items-center justify-center hover:bg-zinc-900 transition-all duration-300">
        <Tooltip content={soundName} color="foreground">
          <h2 className="truncate">{soundName}</h2>
        </Tooltip>
      </div>
      <div className="flex gap-2">
        <Tooltip content="试听音调0" color="foreground">
          <Button isIconOnly onClick={play(0)}>
            <span className="icon-[line-md--play] size-5" />
          </Button>
        </Tooltip>
        <Tooltip content="试听音调1" color="foreground">
          <Button isIconOnly onClick={play(1)}>
            <span className="icon-[line-md--play] size-5" />
          </Button>
        </Tooltip>
        <Tooltip content="试听音调2" color="foreground">
          <Button isIconOnly onClick={play(2)}>
            <span className="icon-[line-md--play] size-5" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
