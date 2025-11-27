import type { ReactNode } from "react";

interface SidebarShellProps {
    open: boolean;
    onClose: () => void;
    headerHeight: number;
    children: ReactNode;
    searchSlot?: ReactNode;  // ← NEW
}

export function SidebarShell({
    open,
    onClose,
    children,
    headerHeight,
    searchSlot,
}: SidebarShellProps) {
    return (
        <>
            {/* Mobile backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 xl:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed left-0 z-40 w-64
                    border-r border-tertiary-900
                    bg-(--bg-page) backdrop-blur
                    transform transition-transform duration-300
                    h-[calc(100vh-var(--header-height))]
                    xl:translate-x-0
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
                style={{
                    top: headerHeight,
                    height: `calc(100vh - ${headerHeight}px)`,
                    ["--header-height" as any]: `${headerHeight}px`,
                }}
            >
                {/* Header search area (non-scrollable) */}
                <div className="p-4 border-b border-tertiary-900">
                    {searchSlot}
                </div>

                {/* Scrollable document contents */}
                <div className="p-4 h-[calc(100%-3.5rem)] overflow-y-auto">
                    {children}
                </div>
            </aside>
        </>
    );
}
