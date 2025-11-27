import { useState } from "react";
import { Link } from "react-router-dom";
import { useSlugMap } from "../../hooks/useSlugMap";
import { useMode } from "../../hooks/useMode";

import { FaBook, FaChevronDown, FaChevronRight } from "react-icons/fa";

export function SidebarContent() {
    const slugMap = useSlugMap();
    const mode = useMode();

    // Hooks MUST come before any conditional returns
    const [openPlayer, setOpenPlayer] = useState(true);
    const [openDM, setOpenDM] = useState(true);
    const [openGlobal, setOpenGlobal] = useState(false);

    // Now we can safely check loading state
    if (!slugMap) return <div>Loading…</div>;

    // entries: [slug, path]
    const entries = Object.entries(slugMap);

    const playerPages = entries.filter(([_, path]) =>
        path.startsWith("Player Section/")
    );

    const dmPages = entries.filter(([_, path]) =>
        path.startsWith("DM Section/")
    );

    const globalPages = entries.filter(
        ([_, path]) =>
            !path.startsWith("Player Section/") &&
            !path.startsWith("DM Section/")
    );

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Contents</h2>

            {/* PLAYER SECTION */}
            {playerPages.length > 0 && (
                <Section
                    title="Player Section"
                    open={openPlayer}
                    onToggle={() => setOpenPlayer(!openPlayer)}
                >
                    {playerPages.map(([slug]) => (
                        <LinkItem
                            key={slug}
                            to={`/page/${encodeURIComponent(slug)}`}
                            icon={<FaBook className="text-blue-300 opacity-80" />}
                            label={slug}
                        />
                    ))}
                </Section>
            )}

            {/* DM SECTION — only shown in DM mode */}
            {mode === "dm" && dmPages.length > 0 && (
                <Section
                    title="DM Section"
                    open={openDM}
                    onToggle={() => setOpenDM(!openDM)}
                >
                    {dmPages.map(([slug]) => (
                        <LinkItem
                            key={slug}
                            to={`/page/${encodeURIComponent(slug)}`}
                            icon={<FaBook className="text-yellow-300 opacity-80" />}
                            label={slug}
                        />
                    ))}
                </Section>
            )}

            {/* GLOBAL FILES — DM only */}
            {mode === "dm" && globalPages.length > 0 && (
                <Section
                    title="Uncategorized"
                    open={openGlobal}
                    onToggle={() => setOpenGlobal(!openGlobal)}
                >
                    {globalPages.map(([slug]) => (
                        <LinkItem
                            key={slug}
                            to={`/page/${encodeURIComponent(slug)}`}
                            icon={<FaBook className="text-gray-300 opacity-80" />}
                            label={slug}
                        />
                    ))}
                </Section>
            )}
        </>
    );
}

/* Supporting components stay the same */

function Section({ title, open, onToggle, children }: any) {
    return (
        <div className="mb-5">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full text-left mb-2"
            >
                <span className="text-sm font-semibold opacity-70">
                    {title}
                </span>
                {open ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </button>

            <div
                className={`transition-all overflow-hidden ${
                    open ? "max-h-full" : "max-h-0"
                }`}
            >
                <ul className="space-y-1 pl-2">{children}</ul>
            </div>
        </div>
    );
}

function LinkItem({ to, icon, label }: any) {
    return (
        <li>
            <Link to={to} className="flex items-center gap-2 hover:text-blue-400">
                {icon}
                {label}
            </Link>
        </li>
    );
}
