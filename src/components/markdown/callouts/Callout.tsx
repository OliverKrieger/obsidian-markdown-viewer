import type { ReactNode } from "react";

export type CalloutType =
    | "info"
    | "note"
    | "tip"
    | "warning"
    | "danger"
    | "quote"
    | "lore"   // custom
    | string;

interface CalloutProps {
    type: CalloutType;
    title?: string;
    children?: ReactNode;
}

// Map each callout type to icon + colors
const calloutConfig: Record<
    string,
    { icon: string; border: string; bg: string; title: string }
> = {
    info: {
        icon: "💡",
        border: "border-blue-500",
        bg: "bg-blue-950/30",
        title: "text-blue-300",
    },
    note: {
        icon: "📝",
        border: "border-purple-500",
        bg: "bg-purple-900/30",
        title: "text-purple-300",
    },
    tip: {
        icon: "✨",
        border: "border-emerald-500",
        bg: "bg-emerald-950/30",
        title: "text-emerald-300",
    },
    warning: {
        icon: "⚠️",
        border: "border-yellow-500",
        bg: "bg-yellow-900/30",
        title: "text-yellow-300",
    },
    danger: {
        icon: "🔥",
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

    // 🌙 CUSTOM LORE CALLOUT
    lore: {
        icon: "📝",
        border: "border-emerald-600/60",
        bg: "bg-emerald-950/20",
        title: "text-emerald-300",
    },
};

// fallback for unknown callouts
const fallback = {
    icon: "📘",
    border: "border-zinc-600",
    bg: "bg-zinc-950/30",
    title: "text-zinc-300",
};

export function Callout({ type, title, children }: CalloutProps) {
    const cfg = calloutConfig[type] || fallback;

    return (
        <div
            className={`my-6 p-4 rounded-lg border-l-4 shadow-inner ${cfg.border} ${cfg.bg}`}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{cfg.icon}</span>

                {title && (
                    <span className={`font-bold ${cfg.title}`}>
                        {title}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="pl-7">{children}</div>
        </div>
    );
}
