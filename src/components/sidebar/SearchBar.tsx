import Fuse from "fuse.js";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export function SearchBar({ entries }: { entries: [string, string][] }) {
    const [query, setQuery] = useState("");

    const fuse = useMemo(() => {
        return new Fuse(entries.map(([slug]) => slug), {
            threshold: 0.3,
            keys: []
        });
    }, [entries]);

    const results = query ? fuse.search(query).map(r => r.item) : [];

    return (
        <div className="mb-4">
            <input
                className="w-full p-2 rounded bg-tertiary-900/20 text-sm"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {query && (
                <ul className="mt-2 space-y-1">
                    {results.map((slug) => (
                        <li key={slug}>
                            <Link
                                to={`/page/${encodeURIComponent(slug)}`}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                                {slug}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
