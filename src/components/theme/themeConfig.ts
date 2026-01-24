// src/theme/themeConfig.ts
export const THEMES = [
    { id: "theme-base", label: "Base", recommendedMode: "dark" },
    { id: "theme-arcane", label: "Arcane", recommendedMode: "light" },
    { id: "theme-frosty-inferno", label: "Frosty Inferno", recommendedMode: "dark" },
    { id: "theme-imperial", label: "Imperial Gold", recommendedMode: "light" },
    { id: "theme-parchment", label: "Parchment", recommendedMode: "light" },
] as const;

export type ThemeId = typeof THEMES[number]["id"];
export type ColorMode = "light" | "dark";
