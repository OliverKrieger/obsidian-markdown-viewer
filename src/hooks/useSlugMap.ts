import { useEffect, useState } from "react";
import { useMode } from "./useMode";

export function useSlugMap() {
    const mode = useMode();
    const [map, setMap] = useState<Record<string, string> | null>(null);

    useEffect(() => {
        const manifestFile =
            mode === "player"
                ? "/content/player-manifest.json"
                : "/content/dm-manifest.json";

        fetch(manifestFile)
            .then((r) => r.json())
            .then((data) => setMap(data.slugMap))
            .catch(() => setMap({}));
    }, [mode]);

    return map;
}
