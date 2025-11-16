import { TbHomeSpark } from "react-icons/tb";

import { useTheme } from "../hooks/themes/useTheme";  // new hook
import { useDarkMode } from "../hooks/themes/useDarkMode"; // new hook

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { toggleTheme } = useTheme();   // new hook
    const { darkMode, toggleDarkMode } = useDarkMode();     // new hook

    return (
        <div
            className={`min-h-screen w-full flex flex-col`}
            style={{
                backgroundColor: "var(--bg-page)",
                color: "var(--text-page)",
            }}
        >
            <header className="p-4 border-b flex items-center justify-between">
                <a href="/" className="text-lg font-semibold">
                    <div className="flex items-center">
                        <TbHomeSpark className="inline-block mr-2" />
                        <p>The Shattered Crown</p>
                    </div>
                </a>

                <div className="flex gap-3 items-center opacity-80 text-sm">
                    <button onClick={toggleDarkMode} className="hover:opacity-100">
                        {darkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>

                    <button onClick={toggleTheme} className="hover:opacity-100">
                        🎨 Theme
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full overflow-x-hidden">
                {children}
            </main>
        </div>
    );
};
