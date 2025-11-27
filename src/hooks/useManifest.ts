import { useEffect, useState } from "react";
import { useMode } from "./useMode";

export interface ContentManifest {
    mode: "player" | "dm";
    playerFolder: string;
    dmFolder?: string;
    slugMap: Record<string, string>;
    images: string[];
    missing: string[];
}

export function useManifest(): ContentManifest | null {
    const mode = useMode();
    const [manifest, setManifest] = useState<ContentManifest | null>(null);

    useEffect(() => {
        const manifestFile =
            mode === "player"
                ? "/content/player-manifest.json"
                : "/content/dm-manifest.json";

        fetch(manifestFile)
            .then((r) => r.json())
            .then((data) => setManifest(data))
            .catch((err) => {
                console.error("Failed to load manifest:", err);
                setManifest({
                    mode,
                    playerFolder: "Player Section",
                    slugMap: {},
                    images: [],
                    missing: [],
                });
            });
    }, [mode]);

    return manifest;
}
