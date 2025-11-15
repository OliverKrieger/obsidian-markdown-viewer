import { TbHomeSpark } from "react-icons/tb";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex flex-col">
        <header className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <a href="/" className="text-lg font-semibold">
                <div className="flex items-center">
                    <TbHomeSpark className="inline-block mr-2" />
                    <p>The Shattered Crown</p>
                </div>
            </a>
            <span className="text-sm opacity-70">Player Compendium</span>
        </header>

        {/* The magic fix: flex-grow ensures the page always fills full height */}
        <main className="flex-1 w-full overflow-x-hidden">
            {children}
        </main>
    </div>
);