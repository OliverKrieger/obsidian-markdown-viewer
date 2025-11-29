import { useState, useRef, useLayoutEffect } from "react";
import { TbHomeSpark, TbMenu2 } from "react-icons/tb";

import { SidebarShell } from "./sidebar/SidebarShell";
import { SidebarContent } from "./sidebar/SidebarContent";
import { SidebarSearch } from "./sidebar/SidebarSearch";
import { ThemeSwitcher } from "./theme/ThemeSwitcher";
import { useSlugMap } from "../hooks/useSlugMap";
import { ModeToggle } from "./view_mode/ModeToggle";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    const headerRef = useRef<HTMLDivElement>(null);

    // Measure header height on mount + resize
    useLayoutEffect(() => {
        function update() {
            if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
        }

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return (
        <div
            className="min-h-screen w-full flex flex-col relative"
            style={{
                backgroundColor: "var(--bg-page)",
                color: "var(--text-page)",
            }}
        >
            {/* HEADER (measured) */}
            <header
                ref={headerRef}
                className="
                    sticky top-0 z-50
                    p-4 
                    border-b border-tertiary-900 
                    flex items-center justify-between
                    bg-(--bg-page)
                "
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="xl:hidden p-2 rounded hover:bg-tertiary-900/20"
                    >
                        <TbMenu2 size={22} />
                    </button>

                    <a href="/" className="text-lg font-semibold flex items-center gap-2">
                        <TbHomeSpark />
                        <span>The Shattered Crown</span>
                    </a>

                    {/* Mode toggle (dev only) */}
                    <ModeToggle />
                </div>

                <ThemeSwitcher />
            </header>

            {/* SIDEBAR BELOW HEADER */}
            <SidebarShell
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                headerHeight={headerHeight}
                searchSlot={<SidebarSearch entries={Object.entries(useSlugMap() || {})} />}
            >
                <SidebarContent />
            </SidebarShell>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-x-hidden xl:ml-64">
                {children}
            </main>
        </div>
    );
};
