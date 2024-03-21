"use client";

import {Tab, Tabs} from "@nextui-org/react";
import {usePathname} from "next/navigation";

export function Navigation() {
    const pathname = usePathname().split("/")[1];
    return (
        <nav className="flex justify-center items-center gap-10 relative h-16 lg:h-auto">
            <Tabs aria-label="Options" selectedKey={pathname}>
                <Tab key="market" title="广场" href="/market/1"/>
                <Tab key="editor" title="编辑器" href="/editor"/>
            </Tabs>
        </nav>
    );
}
