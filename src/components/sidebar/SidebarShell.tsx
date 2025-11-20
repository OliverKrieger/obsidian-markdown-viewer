// components/sidebar/SidebarShell.tsx
import type { ReactNode } from "react";

interface SidebarShellProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

export function SidebarShell({ open, onClose, children }: SidebarShellProps) {
    return (
        <>
            {/* BACKDROP for mobile */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* SIDEBAR PANEL */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 z-40
                    border-r border-tertiary-900 bg-neutral-950/90 backdrop-blur
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="p-4 text-neutral-100 h-full overflow-y-auto">
                    {children}
                </div>
            </aside>
        </>
    );
}
