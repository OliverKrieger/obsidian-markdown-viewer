// utils/extractMissingPages.ts
export function extractMissingPagesFromWindow(): string[] {
    if (typeof document === "undefined") return [];

    const selector = 'a[href^="/__missing__/"]';
    const nodes = document.querySelectorAll(selector);

    return [...nodes].map((el) => {
        const href = el.getAttribute("href")!;
        return decodeURIComponent(href.replace("/__missing__/", ""));
    });
}
