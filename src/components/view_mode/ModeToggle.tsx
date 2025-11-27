import { useMode, useSetMode } from "../../hooks/useMode";

export function ModeToggle() {
    const isDev = import.meta.env.VITE_MODE === "development";
    const mode = useMode();
    const setMode = useSetMode();

    if (!isDev) return null;

    const nextMode = mode === "player" ? "dm" : "player";

    return (
        <button
            onClick={() => setMode(nextMode)}
            className="
                ml-4 px-3 py-1 rounded text-sm font-medium 
                bg-tertiary-900/30 hover:bg-tertiary-900/50
                transition-colors cursor-pointer
            "
            title="Click to toggle viewer mode"
        >
            Viewer Mode:{" "}
            <span
                className={`font-bold ${mode === "player" ? "text-blue-400" : "text-yellow-400"
                    }`}
            >
                {mode.toUpperCase()}
            </span>
        </button>
    );
}
