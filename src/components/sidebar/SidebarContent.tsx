import { useState } from "react";
import { Link } from "react-router-dom";
import { useSlugMap } from "../../hooks/useSlugMap";
import { useMode } from "../../hooks/useMode";
import { useCurrentSlug } from "../../utils/useCurrentSlug";
import { buildFolderTree } from "../../utils/buildFolderTree";
import type { TreeNode } from "../../utils/buildFolderTree";

import { FaBook, FaChevronDown, FaChevronRight } from "react-icons/fa";

export function SidebarContent() {
    const slugMap = useSlugMap();
    const mode = useMode();
    const currentSlug = useCurrentSlug();

    if (!slugMap) return <div>Loading…</div>;

    const entries = Object.entries(slugMap);
    const tree = buildFolderTree(entries);

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Contents</h2>

            {tree.map((node) => (
                <FolderNode
                    key={node.name}
                    node={node}
                    mode={mode}
                    currentSlug={currentSlug}
                />
            ))}
        </>
    );
}

/* Recursive folder viewer */
function FolderNode({
    node,
    mode,
    currentSlug
}: {
    node: TreeNode;
    mode: "player" | "dm";
    currentSlug: string | null;
}) {
    // hide DM section in player mode
    if (mode === "player" && node.name === "DM Section") return null;

    const [open, setOpen] = useState(true);

    return (
        <div className="mb-2">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full text-left"
            >
                <span className="text-sm font-semibold opacity-70">{node.name}</span>
                {open ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </button>

            {open && (
                <ul className="pl-3 mt-1 space-y-1">
                    {node.files.map((slug) => (
                        <li key={slug}>
                            <Link
                                to={`/page/${encodeURIComponent(slug)}`}
                                className={`flex items-center gap-2
                                    hover:text-blue-300
                                    ${currentSlug === slug ? "text-blue-400 font-bold" : ""}`}
                            >
                                <FaBook className="opacity-80" />
                                {slug}
                            </Link>
                        </li>
                    ))}

                    {node.folders.map((sub) => (
                        <FolderNode
                            key={sub.name}
                            node={sub}
                            mode={mode}
                            currentSlug={currentSlug}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
