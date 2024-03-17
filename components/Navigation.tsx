import Link from "next/link";

export function Navigation() {
    return (
        <nav className="flex justify-center items-center gap-10 relative h-16 lg:h-auto">
            <div className="group w-fit flex gap-2 border rounded-full px-4 py-2 bg-zinc-800 *:text-lg *:transition-all *:duration-300 *:font-semibold *:text-gray-300 hover:bg-zinc-900 transition-all duration-300">
                <Link href="/" className="hover:!text-gray-300 group-hover:text-gray-500">首页</Link>
                <Link href="/market" className="hover:!text-gray-300 group-hover:text-gray-500">广场</Link>
                <Link href="/editor" className="hover:!text-gray-300 group-hover:text-gray-500">编辑器</Link>
            </div>
        </nav>
    )
}