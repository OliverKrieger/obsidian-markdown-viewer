export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 min-w-screen">
        <header className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <a href="/" className="text-lg font-semibold">
                <h1 className="text-xl font-bold tracking-wide">The Shattered Crown</h1>
            </a>
            <span className="text-sm opacity-70">Player Compendium</span>
        </header>
        <main>{children}</main>
    </div>
);