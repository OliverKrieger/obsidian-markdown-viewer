import { THEMES } from "../theme/themeConfig";
import type { ThemeId } from "../theme/themeConfig";

import { useTheme } from "../../hooks/themes/useTheme";
import { useDarkMode } from "../../hooks/themes/useDarkMode";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const { mode, setMode } = useDarkMode();

    function handleThemeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newTheme = e.target.value as ThemeId;
        setTheme(newTheme);

        const recommended = THEMES.find((t) => t.id === newTheme)?.recommendedMode;
        if (recommended) {
            setMode(recommended);
        }
    }

    const selectStyle: React.CSSProperties = {
        backgroundColor: "var(--bg-page)",
        color: "var(--text-page)",
        borderColor: "var(--color-border-subtle)",
    };

    const optionStyle: React.CSSProperties = {
        background: "var(--bg-page)",
        color: "var(--text-page)",
    };

    return (
        <div className="flex flex-col gap-2 text-sm opacity-80 hover:opacity-100">
            {/* Mode */}
            <label className="font-semibold text-xs">Mode</label>
            <select
                className="border p-1 rounded outline-none"
                style={selectStyle}
                value={mode}
                onChange={(e) => setMode(e.target.value as "light" | "dark")}
            >
                <option value="light" style={optionStyle}>Light</option>
                <option value="dark" style={optionStyle}>Dark</option>
            </select>

            {/* Theme */}
            <label className="font-semibold text-xs mt-2">Theme</label>
            <select
                className="border p-1 rounded outline-none"
                style={selectStyle}
                value={theme}
                onChange={handleThemeChange}
            >
                {THEMES.map((t) => (
                    <option key={t.id} value={t.id} style={optionStyle}>
                        {t.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
