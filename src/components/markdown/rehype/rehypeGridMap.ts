import { visit } from "unist-util-visit";
import type { Root, Element, Text } from "hast";

function isElement(node: any): node is Element {
    return node && node.type === "element";
}

function textFrom(node: Element): string {
    return (node.children || [])
        .map((c: any) => {
            if (c.type === "text") return (c as Text).value;
            if (c.type === "element") return textFrom(c as Element);
            return "";
        })
        .join("");
}

export function rehypeGridMap() {
    return (tree: Root) => {
        visit(tree, "element", (node: Element, index, parent) => {
            if (!parent || typeof index !== "number") return;
            if (node.tagName !== "blockquote") return;

            //
            // 1. Find the "[!grid-map]" paragraph
            //
            const triggerIndex = node.children.findIndex((child: any) => {
                return (
                    child.type === "element" &&
                    child.tagName === "p" &&
                    textFrom(child).trim() === "[!grid-map]"
                );
            });
            if (triggerIndex === -1) return;

            // Everything after this paragraph is content
            const contentNodes = node.children.slice(triggerIndex + 1);

            //
            // Prepare props
            //
            let title = "";
            let map = "";
            let rows: number | undefined = undefined;
            let cols: number | undefined = undefined;
            let prefix = "";
            const cells: string[] = [];

            //
            // 2. Parse content nodes
            //
            for (const child of contentNodes) {
                if (child.type !== "element") continue;
                const el = child as Element;

                //
                // 2a. MAIN PROPS ARE INSIDE THE *BIG PARAGRAPH*
                //
                if (el.tagName === "p") {
                    // Extract all text content and split by newlines
                    const fullText = textFrom(el);
                    const lines = fullText
                        .split(/\r?\n/)
                        .map((l) => l.trim())
                        .filter((l) => l.length > 0);

                    // Look for <img> child for the map
                    const imgChild = (el.children || []).find(
                        (c: any) => isElement(c) && c.tagName === "img"
                    );

                    if (imgChild && isElement(imgChild)) {
                        const src = imgChild.properties?.src as string | undefined;
                        if (src) map = src;
                    }

                    // First non-meta line is title
                    if (!title && lines.length > 0) {
                        title = lines[0];
                    }

                    // Parse other lines
                    for (const line of lines) {
                        if (/^map:/i.test(line)) {
                            // handled above via <img>
                        } else if (/^rows:/i.test(line)) {
                            rows = Number(
                                line.replace(/rows:/i, "").trim()
                            );
                        } else if (/^cols:/i.test(line)) {
                            cols = Number(
                                line.replace(/cols:/i, "").trim()
                            );
                        } else if (/^prefix:/i.test(line)) {
                            prefix = line
                                .replace(/prefix:/i, "")
                                .trim();
                        }
                    }

                    continue;
                }

                //
                // 2b. Ignore <h1>Cells</h1> etc (they are section headers)
                //
                if (/^h[1-6]$/.test(el.tagName)) {
                    continue;
                }

                //
                // 2c. Parse the <ul> list of cells
                //
                if (el.tagName === "ul") {
                    for (const li of el.children) {
                        if (
                            li.type === "element" &&
                            li.tagName === "li"
                        ) {
                            const value = textFrom(li as Element).trim();
                            if (value) cells.push(value);
                        }
                    }
                    continue;
                }
            }

            //
            // 3. Replace blockquote with <grid-map>
            //
            parent.children[index] = {
                type: "element",
                tagName: "grid-map",
                properties: {
                    title,
                    map,
                    rows,
                    cols,
                    prefix,
                    cells,
                },
                children: [],
            } as Element;
        });
    };
}
