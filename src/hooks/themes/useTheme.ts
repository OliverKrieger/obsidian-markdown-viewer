import { useEffect, useState } from "react";
import { THEMES } from "../../components/theme/themeConfig";
import type { ThemeId } from "../../components/theme/themeConfig";

const STORAGE_KEY = "app-theme";

export function useTheme() {
    const [theme, setTheme] = useState<ThemeId>(() => {
        return (localStorage.getItem(STORAGE_KEY) as ThemeId) || "theme-base";
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, theme);

        // Remove previous theme classes
        document.documentElement.classList.remove(
            ...THEMES.map((t) => t.id)
        );

        // Apply new theme class
        document.documentElement.classList.add(theme);
    }, [theme]);

    return {
        theme,
        setTheme,
    };
}
