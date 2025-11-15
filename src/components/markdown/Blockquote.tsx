import type { ReactNode } from "react";

export function Blockquote({ children }: { children?: ReactNode }) {
    return (
        <blockquote
            className="
                border-l-4 border-emerald-600/60 
                pl-4 ml-1 my-6 
                italic
                text-emerald-200/90 
                bg-zinc-900/40 
                rounded-r-lg 
                py-3
                shadow-inner
            "
        >
            {children}
        </blockquote>
    );
}
