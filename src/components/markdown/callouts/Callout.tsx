import type { ReactNode } from "react";

// Icons
import { FaInfoCircle } from "react-icons/fa";
import { GiSpellBook, GiQuillInk, GiRuneStone, GiCastle } from "react-icons/gi";
import { MdWarning, MdDangerous } from "react-icons/md";

export type CalloutType =
    | "info"
    | "note"
    | "tip"
    | "warning"
    | "danger"
    | "quote"
    | "lore"
    | "region"
    | string;

interface CalloutProps {
    type: CalloutType;
    title?: string;
    children?: ReactNode;
}

const calloutConfig: Record<
    string,
    {
        icon: string | React.ComponentType<{ className?: string }>;
        border: string;
        bg: string;
        title: string;
        text?: string;
    }
> = {
    info: {
        icon: FaInfoCircle,
        border: "border-blue-500",
        bg: "bg-blue-950/30",
        title: "text-blue-300",
    },
    note: {
        icon: GiQuillInk,
        border: "border-purple-500",
        bg: "bg-purple-900/30",
        title: "text-purple-300",
    },
    tip: {
        icon: GiRuneStone,
        border: "border-emerald-500",
        bg: "bg-emerald-950/30",
        title: "text-emerald-300",
    },
    warning: {
        icon: MdWarning,
        border: "border-yellow-500",
        bg: "bg-yellow-900/30",
        title: "text-yellow-300",
    },
    danger: {
        icon: MdDangerous,
        border: "border-red-500",
        bg: "bg-red-900/30",
        title: "text-red-300",
    },
    quote: {
        icon: "❝",
        border: "border-zinc-600",
        bg: "bg-zinc-900/40",
        title: "text-zinc-300",
    },

    lore: {
        icon: GiSpellBook,
        border: "border-emerald-600/60",
        bg: "bg-emerald-900/70",
        title: "text-emerald-300",
        text: "text-white",
    },
    region: {
        icon: GiCastle,
        border: "border-purple-500",
        bg: "bg-purple-900/70",
        title: "text-purple-300",
        text: "text-white",
    },
};

const fallback = {
    icon: "📘",
    border: "border-zinc-600",
    bg: "bg-zinc-950/30",
    title: "text-zinc-300",
};

export function Callout({ type, title, children }: CalloutProps) {
    const cfg = calloutConfig[type] || fallback;
    const Icon = cfg.icon;

    return (
        <div className={`my-6 p-4 rounded-lg border-l-4 shadow-inner ${cfg.border} ${cfg.bg} ${cfg.text || ""}`}>
            <div className="flex items-center gap-2 mb-2">
                {typeof Icon === "string" ? (
                    <span className="text-xl">{Icon}</span>
                ) : (
                    <Icon className="text-xl" />
                )}

                {title && (
                    <span className={`font-bold ${cfg.title}`}>{title}</span>
                )}
            </div>

            <div className={`pl-7`}>{children}</div>
        </div>
    );
}
