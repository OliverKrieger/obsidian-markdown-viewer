import { useState } from "react";

export function useDarkMode() {
    const [darkMode, setDarkMode] = useState(
        () => document.documentElement.classList.contains("dark")
    );

    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark");
        setDarkMode(document.documentElement.classList.contains("dark"));
    };

    return { darkMode, toggleDarkMode };
}