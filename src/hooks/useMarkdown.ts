import { useEffect, useState } from 'react';

export function useMarkdown(path: string) {
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!path) return;
        fetch(path)
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText);
                return res.text();
            })
            .then(setContent)
            .catch((e) => setError(e.message));
    }, [path]);

    return { content, error };
}
