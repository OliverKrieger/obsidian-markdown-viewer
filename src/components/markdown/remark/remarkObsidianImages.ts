import { visit } from "unist-util-visit";

export function remarkObsidianImages() {
    return (tree: any) => {
        visit(tree, "paragraph", (node) => {
            if (!node.children) return;

            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];

                // Look for raw text containing ![[...]]
                if (child.type === "text" && child.value.includes("![[")) {
                    const matches = [...child.value.matchAll(/!\[\[([^\]]+)\]\]/g)];

                    if (matches.length === 0) continue;

                    const newNodes = [];
                    let remaining = child.value;

                    for (const match of matches) {
                        const full = match[0];           // ![[foo.png]]
                        const inner = match[1];          // foo.png or folder/foo.png

                        const [file, alt = ""] = inner.split("|");

                        const before = remaining.slice(0, remaining.indexOf(full));
                        if (before.trim()) {
                            newNodes.push({ type: "text", value: before });
                        }

                        // Create new image node
                        newNodes.push({
                            type: "image",
                            url: `/content/${file}`,
                            alt: alt || "",
                        });

                        remaining = remaining.slice(remaining.indexOf(full) + full.length);
                    }

                    if (remaining.trim()) {
                        newNodes.push({ type: "text", value: remaining });
                    }

                    // Replace original text node with new nodes
                    node.children.splice(i, 1, ...newNodes);
                    i += newNodes.length - 1;
                }
            }
        });
    };
}
