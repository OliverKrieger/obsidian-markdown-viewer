import { THEMES } from "../theme/themeConfig";
import type { ThemeId } from "../theme/themeConfig";

import { useTheme } from "../../hooks/themes/useTheme";
import { useDarkMode } from "../../hooks/themes/useDarkMode";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const { mode, setMode, toggleMode } = useDarkMode();

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
        <div className="flex flex-row gap-2">
            <div 
                className="flex flex-col items-start cursor-pointer hover:text-brand-500 transition-all ease-in-out duration-200"
                onClick={toggleMode}
            >
                {/* Mode */}
                <div className="font-semibold text-md uppercase">Mode</div>
                <span className="text-xs italic">{mode}</span>
            </div>

            <div className="flex flex-col items-start uppercase">
                {/* Theme */}
                <label className="font-semibold text-md ml-1">Theme</label>
                <select
                    className="border rounded outline-none text-xs border-none italic"
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
        </div>
    );
}
