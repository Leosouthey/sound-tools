"use client";

import {useRouter} from "next/navigation";
import {Button} from "@nextui-org/react";

export function Back() {
    const router = useRouter();
    return (
        <div className="absolute top-0 -left-12">
            <Button isIconOnly onClick={() => router.back()} className="!size-[36px] !min-w-0">
                <span className="icon-[line-md--backup-restore] size-5"/>
            </Button>
        </div>
    )
}