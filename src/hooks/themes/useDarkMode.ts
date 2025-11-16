import { useEffect, useState } from "react";

const MODE_KEY = "app-color-mode";

export function useDarkMode() {
    const [mode, setMode] = useState<"light" | "dark">(() => {
        return (localStorage.getItem(MODE_KEY) as "light" | "dark") || "light";
    });

    useEffect(() => {
        localStorage.setItem(MODE_KEY, mode);

        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [mode]);

    return {
        mode,
        setMode,
        toggleMode: () => setMode(mode === "dark" ? "light" : "dark"),
    };
}
