// src/components/markdown/rehype/rehypeGridMap.ts
import { visit } from "unist-util-visit";
import type { Root, Element, Text } from "hast";

function textFrom(node: Element): string {
    return (node.children || [])
        .map((c: any) => {
            if (c.type === "text") return (c as Text).value;
            if (c.type === "element") return textFrom(c as Element);
            return "";
        })
        .join("");
}

function isElement(node: any): node is Element {
    return node && node.type === "element";
}

export function rehypeGridMap() {
    return (tree: Root) => {
        visit(tree, "element", (node: Element, index, parent) => {
            if (!parent || typeof index !== "number") return;
            if (node.tagName !== "blockquote") return;

            // 1. Find the `[!grid-map]` marker paragraph
            const triggerIndex = node.children.findIndex((child: any) => {
                return (
                    isElement(child) &&
                    child.tagName === "p" &&
                    textFrom(child).trim() === "[!grid-map]"
                );
            });

            if (triggerIndex === -1) return;

            const contentNodes = node.children.slice(triggerIndex + 1);

            let title = "";
            let map = "";
            let rows: number | undefined = undefined;
            let cols: number | undefined = undefined;
            let prefix = "";
            let labelStyle = "letters-numbers";
            const cells: string[] = [];

            for (const child of contentNodes) {
                if (!isElement(child)) continue;
                const el = child as Element;

                // Main paragraph containing title, map, rows, cols, prefix, labelStyle
                if (el.tagName === "p") {
                    const fullText = textFrom(el);
                    const lines = fullText
                        .split(/\r?\n/)
                        .map((l) => l.trim())
                        .filter((l) => l.length > 0);

                    // Find <img> child -> resolved src from Obsidian images
                    const imgChild = (el.children || []).find(
                        (c: any) => isElement(c) && c.tagName === "img"
                    );
                    if (imgChild && isElement(imgChild)) {
                        const src = imgChild.properties?.src as
                            | string
                            | undefined;
                        if (src) {
                            map = src; // keep resolved path
                        }
                    }

                    if (!title && lines.length > 0) {
                        title = lines[0];
                    }

                    for (const line of lines) {
                        if (/^map:/i.test(line)) {
                            // handled via <img>
                            continue;
                        } else if (/^rows:/i.test(line)) {
                            const num = Number(
                                line.replace(/rows:/i, "").trim()
                            );
                            if (!Number.isNaN(num)) rows = num;
                        } else if (/^cols:/i.test(line)) {
                            const num = Number(
                                line.replace(/cols:/i, "").trim()
                            );
                            if (!Number.isNaN(num)) cols = num;
                        } else if (/^prefix:/i.test(line)) {
                            prefix = line
                                .replace(/prefix:/i, "")
                                .trim();
                        } else if (/^labelStyle:/i.test(line)) {
                            labelStyle = line
                                .replace(/labelStyle:/i, "")
                                .trim();
                        }
                    }

                    continue;
                }

                // Ignore section headings like "# Cells"
                if (/^h[1-6]$/.test(el.tagName)) {
                    continue;
                }

                // List of cells
                if (el.tagName === "ul" || el.tagName === "ol") {
                    for (const li of el.children) {
                        if (isElement(li) && li.tagName === "li") {
                            const value = textFrom(li).trim();
                            if (value) cells.push(value);
                        }
                    }
                    continue;
                }
            }

            parent.children[index] = {
                type: "element",
                tagName: "grid-map",
                properties: {
                    title,
                    map,
                    rows,
                    cols,
                    prefix,
                    labelStyle,
                    cells,
                },
                children: [],
            } as Element;
        });
    };
}
