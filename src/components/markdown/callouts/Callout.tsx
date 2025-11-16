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

const calloutIcons: Record<
    string,
    string | React.ComponentType<{ className?: string }>
> = {
    info: FaInfoCircle,
    note: GiQuillInk,
    tip: GiRuneStone,
    warning: MdWarning,
    danger: MdDangerous,
    quote: RiChatQuoteLine,
    lore: GiSpellBook,
    region: GiCastle,
};

const fallbackIcon = FaBook;

export function Callout({ type, title, children }: CalloutProps) {
    const key = type.toLowerCase();
    const Icon = calloutIcons[key] || fallbackIcon;

    const cssVar = (suffix: string) => `var(--callout-${key}-${suffix})`;

    return (
        <div
            className="callout-base"
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
