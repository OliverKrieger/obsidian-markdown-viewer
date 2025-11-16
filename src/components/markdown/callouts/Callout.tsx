import type { ReactNode } from "react";

// Icons
import { FaInfoCircle, FaBook } from "react-icons/fa";
import { GiSpellBook, GiQuillInk, GiRuneStone, GiCastle } from "react-icons/gi";
import { MdWarning, MdDangerous } from "react-icons/md";
import { RiChatQuoteLine } from "react-icons/ri";

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
    }
> = {
    info: {
        icon: FaInfoCircle,
    },
    note: {
        icon: GiQuillInk,
    },
    tip: {
        icon: GiRuneStone,
    },
    warning: {
        icon: MdWarning,
    },
    danger: {
        icon: MdDangerous,
    },
    quote: {
        icon: RiChatQuoteLine,
    },

    lore: {
        icon: GiSpellBook,
    },
    region: {
        icon: GiCastle,
    },
};

const fallback = {
    icon: FaBook ,
};

export function Callout({ type, title, children }: CalloutProps) {
    const key = type.toLowerCase();
    const cssVar = (suffix: string) => `var(--callout-${key}-${suffix})`;

    const Icon = calloutConfig[key]?.icon ?? fallback.icon;

    return (
        <div
            className="my-6 p-4 rounded-md border-l-4 shadow-sm"
            style={{
                borderColor: cssVar("border"),
                background: cssVar("bg"),
                color: cssVar("text"),
            }}
        >
            <div className="flex items-center gap-2 mb-2">
                {typeof Icon === "string" ? (
                    <span className="text-xl">{Icon}</span>
                ) : (
                    <Icon className="text-xl" />
                )}

                {title && (
                    <span
                        className="font-bold"
                        style={{ color: cssVar("title") }}
                    >
                        {title}
                    </span>
                )}
            </div>

            <div className="pl-7">{children}</div>
        </div>
    );
}
