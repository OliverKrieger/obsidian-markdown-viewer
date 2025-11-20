// components/sidebar/SidebarShell.tsx
import type { ReactNode } from "react";

interface SidebarShellProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    headerHeight: number;
}

export function SidebarShell({ open, onClose, children, headerHeight }: SidebarShellProps) {
    return (
        <>
            {/* Mobile backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed left-0 z-40 w-64
                    border-r border-tertiary-900
                    bg-neutral-950/90 backdrop-blur
                    transform transition-transform duration-300
                    h-[calc(100vh-var(--header-height))]
                    md:translate-x-0
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
                style={{
                    top: headerHeight,
                    height: `calc(100vh - ${headerHeight}px)`,
                    // custom CSS var for reuse inside children
                    ["--header-height" as any]: `${headerHeight}px`,
                }}
            >
                <div className="p-4 h-full overflow-y-auto">{children}</div>
            </aside>
        </>
    );
}
