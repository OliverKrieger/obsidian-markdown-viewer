// components/sidebar/SidebarContent.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useSlugMap } from "../../hooks/useSlugMap";
import { extractMissingPagesFromWindow } from "../../utils/extractMissingPages";

import { FaBook, FaQuestionCircle, FaChevronDown, FaChevronRight } from "react-icons/fa";

export function SidebarContent() {
    const slugMap = useSlugMap();

    // Collapsible section states
    const [openPages, setOpenPages] = useState(true);
    const [openMissing, setOpenMissing] = useState(true);

    const existingPages = slugMap ? Object.keys(slugMap).sort() : [];

    const missingPages = useMemo(() => {
        const discovered = extractMissingPagesFromWindow();
        return [...new Set(discovered)].sort();
    }, [slugMap]);

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Contents</h2>

            {/* Pages */}
            <Section
                title="All Pages"
                open={openPages}
                onToggle={() => setOpenPages(!openPages)}
            >
                {existingPages.map((title) => (
                    <LinkItem
                        key={title}
                        to={`/page/${encodeURIComponent(title)}`}
                        icon={<FaBook className="text-blue-300 opacity-80" />}
                        label={title}
                    />
                ))}
            </Section>

            {/* Missing pages */}
            {missingPages.length > 0 && (
                <Section
                    title="Missing Pages"
                    danger
                    open={openMissing}
                    onToggle={() => setOpenMissing(!openMissing)}
                >
                    {missingPages.map((title) => (
                        <MissingItem key={title} title={title} />
                    ))}
                </Section>
            )}
        </>
    );
}

/* Supporting components */

function Section({
    title,
    open,
    onToggle,
    children,
    danger = false,
}: {
    title: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    danger?: boolean;
}) {
    return (
        <div className="mb-5">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full text-left mb-2"
            >
                <span
                    className={`text-sm font-semibold ${danger ? "text-red-400" : "opacity-70"
                        }`}
                >
                    {title}
                </span>
                {open ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </button>

            <div
                className={`transition-all overflow-hidden ${open ? "max-h-full" : "max-h-0"
                    }`}
            >
                <ul className="space-y-1 pl-2">{children}</ul>
            </div>
        </div>
    );
}

function LinkItem({
    to,
    icon,
    label,
}: {
    to: string;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <li>
            <Link to={to} className="flex items-center gap-2 hover:text-blue-400">
                {icon}
                {label}
            </Link>
        </li>
    );
}

function MissingItem({ title }: { title: string }) {
    return (
        <li className="flex items-center gap-2 text-red-400">
            <FaQuestionCircle className="opacity-80" />
            {title}
        </li>
    );
}
