// Sidebar.tsx
import { useSlugMap } from "../hooks/useSlugMap";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { FaBook, FaQuestionCircle } from "react-icons/fa";
import { extractMissingPagesFromWindow } from "../utils/extractMissingPages";

export function Sidebar() {
    const slugMap = useSlugMap();

    // Always compute these — even during loading
    const existingPages = slugMap ? Object.keys(slugMap).sort() : [];

    const discoveredMissing = extractMissingPagesFromWindow();

    const missingPages = useMemo(
        () => [...new Set(discoveredMissing)].sort(),
        [discoveredMissing]
    );

    // NOW you can branch conditionally
    if (!slugMap) {
        return (
            <aside className="w-64 border-r border-tertiary-900 p-4 text-sm opacity-60 hidden md:block">
                Loading…
            </aside>
        );
    }

    return (
        <aside className="w-64 border-r border-tertiary-900 p-4 overflow-y-auto hidden md:block">
            <h2 className="text-lg font-bold mb-4">Contents</h2>

            {/* Existing Pages */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold opacity-70 mb-2">All Pages</h3>

                <ul className="space-y-1">
                    {existingPages.map((title) => (
                        <li key={title}>
                            <Link
                                to={`/page/${encodeURIComponent(title)}`}
                                className="flex items-center gap-2 hover:text-blue-400"
                            >
                                <FaBook className="text-blue-300 opacity-80" />
                                {title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Missing Pages */}
            {missingPages.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold opacity-70 mb-2 text-red-400">
                        Missing / Wanted Pages
                    </h3>

                    <ul className="space-y-1">
                        {missingPages.map((title) => (
                            <li key={title}>
                                <span className="flex items-center gap-2 text-red-400">
                                    <FaQuestionCircle className="opacity-80" />
                                    {title}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </aside>
    );
}
