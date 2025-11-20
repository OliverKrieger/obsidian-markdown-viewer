import { TbHomeSpark } from "react-icons/tb";

import { Sidebar } from "./Sidebar";
import { ThemeSwitcher } from "./theme/ThemeSwitcher";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div
            className={`min-h-screen w-full flex flex-col`}
            style={{
                backgroundColor: "var(--bg-page)",
                color: "var(--text-page)",
            }}
        >
            {/* LEFT SIDEBAR */}
            
            <Sidebar />

            {/* RIGHT CONTENT AREA */}
            <div className="flex-1 flex flex-col">
                <header className="p-4 border-b border-tertiary-900 flex items-center justify-between">
                    <a href="#/" className="text-lg font-semibold flex items-center gap-2">
                        <TbHomeSpark />
                        <span>The Shattered Crown</span>
                    </a>

                    <ThemeSwitcher />
                </header>

                <main className="flex-1 w-full overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};
