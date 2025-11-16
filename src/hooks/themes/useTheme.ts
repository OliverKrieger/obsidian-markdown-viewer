import { useEffect, useState } from "react";

const THEMES = ["", "theme-arcane"] as const;
type Theme = typeof THEMES[number];

export function useTheme() {
    const [index, setIndex] = useState(0);
    const theme = THEMES[index];

    useEffect(() => {
        // Remove other themes
        THEMES.forEach(t => {
            if (t) document.documentElement.classList.remove(t);
        });

        // Apply new theme
        if (theme) {
            document.documentElement.classList.add(theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setIndex((index + 1) % THEMES.length);
    };

    const setTheme = (t: Theme) => {
        setIndex(THEMES.indexOf(t));
    };

    return { theme, toggleTheme, setTheme };
}
