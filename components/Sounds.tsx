"use client";

import {Input} from "@nextui-org/react";
import {SoundCard} from "./Card";
import {useMemo} from "react";
import {PaginationNav} from "./PaginationNav";
import {Sound} from "@/app/market/[page]/page";
import {useSearchStore} from "@/providers/search-store-provider";

export function Sounds({page, allSounds}: { page: number, allSounds: Sound[] }) {
    const {search, setSearch} = useSearchStore((state) => state);
    const count = 20;
    const filteredSounds = useMemo(
        () =>
            allSounds.filter((sound) =>
                sound.sound.toLowerCase().includes(search.toLowerCase())
            ),
        [allSounds, search]
    );

    const filteredSoundsRender = useMemo(() => {
        return filteredSounds.slice((page - 1) * count, page * count);
    }, [filteredSounds, page]);

    const total = useMemo(() => Math.ceil(filteredSounds.length / count), [filteredSounds]);

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <Input
                type="search"
                placeholder="搜索"
                value={search}
                onValueChange={setSearch}
            />
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                {filteredSoundsRender.map((sound) => (
                    <SoundCard key={sound.sound} sound={sound}/>
                ))}
            </div>
            <PaginationNav total={total} page={page}/>
        </div>
    );
}
