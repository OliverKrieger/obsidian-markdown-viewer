import type { ViewerMode } from "../types/viewer";

export const settings = {
    contentRoot: '/content',
    defaultPageByMode: {
        player: "00 World Overview",
        dm: "00 Overview Dashboard",
    } as Record<ViewerMode, string>
};