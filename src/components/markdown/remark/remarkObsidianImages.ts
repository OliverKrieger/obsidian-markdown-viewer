import { visit } from "unist-util-visit";
import path from "path-browserify";

interface ObsidianImageOptions {
    mdDir: string;               // e.g. "DM Section/Valewryn Arc - Last Echo/Grid/Map"
    allowedImages?: Set<string>; // e.g. from manifest.images
    fileIndex?: Map<string, string[]>; // filename -> [relPaths]
}

/**
 * Converts Obsidian image embeds `![[file.png]]` into <img> nodes
 * using both:
 * - markdown directory (mdDir)
 * - manifest-based file index (optional)
 */
export function remarkObsidianImages(options: ObsidianImageOptions) {
    const { mdDir, allowedImages, fileIndex } = options;

    return (tree: any) => {
        visit(tree, "paragraph", (node) => {
            if (!node.children) return;

            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                if (child.type !== "text" || !child.value.includes("![["))
                    continue;

                const matches = [...child.value.matchAll(/!\[\[([^\]]+)\]\]/g)];
                if (matches.length === 0) continue;

                const newNodes: any[] = [];
                let remaining = child.value;

                for (const match of matches) {
                    const full = match[0];
                    const inner = match[1];

                    const [rawFile, alt = ""] = inner.split("|");
                    const imgBefore = remaining.slice(
                        0,
                        remaining.indexOf(full)
                    );
                    if (imgBefore) {
                        newNodes.push({ type: "text", value: imgBefore });
                    }

                    const resolvedRel = resolveImagePath(
                        mdDir,
                        rawFile.trim(),
                        fileIndex
                    );

                    if (
                        resolvedRel &&
                        (!allowedImages || allowedImages.has(resolvedRel))
                    ) {
                        newNodes.push({
                            type: "image",
                            url: `/content/${resolvedRel}`,
                            alt: alt.trim(),
                        });
                    } else {
                        // Optional: show placeholder instead of nothing
                        newNodes.push({
                            type: "text",
                            value: "[image unavailable]",
                        });
                    }

                    remaining = remaining.slice(
                        remaining.indexOf(full) + full.length
                    );
                }

                if (remaining) {
                    newNodes.push({ type: "text", value: remaining });
                }

                node.children.splice(i, 1, ...newNodes);
                i += newNodes.length - 1;
            }
        });
    };
}

function resolveImagePath(
    mdDir: string,
    raw: string,
    fileIndex?: Map<string, string[]>
): string | null {
    // strip ./ or leading /
    let cleaned = raw.replace(/^\.\//, "").replace(/^\/+/, "");

    // If it contains a slash, treat as path relative to mdDir
    if (cleaned.includes("/")) {
        return path.normalize(path.join(mdDir, cleaned)).replace(/\\/g, "/");
    }

    // Otherwise, bare filename: look in fileIndex
    if (!fileIndex) return null;

    const candidates = fileIndex.get(cleaned) || [];
    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];

    // Prefer something in same subtree as mdDir
    const preferred = candidates.find((c) => c.startsWith(mdDir));
    return preferred || candidates[0];
}
