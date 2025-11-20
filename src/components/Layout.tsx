import { useState } from "react";
import { TbHomeSpark, TbMenu2 } from "react-icons/tb";

import { SidebarShell } from "./sidebar/SidebarShell";
import { SidebarContent } from "./sidebar/SidebarContent";
import { ThemeSwitcher } from "./theme/ThemeSwitcher";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div
            className="min-h-screen w-full flex flex-col relative"
            style={{
                backgroundColor: "var(--bg-page)",
                color: "var(--text-page)",
            }}
        >
            <SidebarShell open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
                <SidebarContent />
            </SidebarShell>

            <div className="flex-1 flex flex-col">
                <header className="p-4 border-b border-tertiary-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 rounded hover:bg-tertiary-900/20"
                        >
                            <TbMenu2 size={22} />
                        </button>

                        <a href="#/" className="text-lg font-semibold flex items-center gap-2">
                            <TbHomeSpark />
                            <span>The Shattered Crown</span>
                        </a>
                    </div>

                    <ThemeSwitcher />
                </header>

                <main className="flex-1 w-full overflow-x-hidden">{children}</main>
            </div>
        </div>
    );
};
