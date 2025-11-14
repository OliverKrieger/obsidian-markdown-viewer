import { useEffect, useState } from "react";

export function useSlugMap() {
    const [map, setMap] = useState<Record<string, string> | null>(null);

    useEffect(() => {
        fetch("/content/Player/index.json")
            .then((res) => res.json())
            .then(setMap)
            .catch(() => setMap({}));
    }, []);

    return map;
}