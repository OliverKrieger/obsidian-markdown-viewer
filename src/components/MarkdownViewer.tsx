// src/components/MarkdownViewer.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkWikiLink from "remark-wiki-link";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { useMarkdown } from "../hooks/useMarkdown";
import { useManifest } from "../hooks/useManifest";

import { WikiLink } from "./markdown/WikiLink";
import { createTableComponents } from "./markdown/TableComponents";
import { createListComponents } from "./markdown/ListComponents";
import { createHeadingComponents } from "./markdown/HeadingComponents";
import { Divider } from "./markdown/Divider";
import { renderCallout } from "./markdown/callouts/renderCallout";
import { remarkObsidianImages } from "./markdown/remark/remarkObsidianImages";

export const MarkdownViewer = ({ path }: { path: string }) => {
    const { content, error } = useMarkdown(path);
    const manifest = useManifest();

    if (!manifest) return <div className="p-6">Loading index…</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
    if (!content) return <div className="p-6">Loading…</div>;

    // path like: /content/DM Section/Valewryn Arc/.../File.md
    const relPath = path.replace(/^\/?content\/?/, "");
    const mdDir = relPath.split("/").slice(0, -1).join("/");

    const allowedImages = new Set(manifest.images || []);
    const fileIndex = new Map<string, string[]>();
    (manifest.images || []).forEach((rel) => {
        const name = rel.split("/").pop()!;
        const list = fileIndex.get(name) || [];
        list.push(rel);
        fileIndex.set(name, list);
    });

    return (
        <article className="max-w-none p-6">
            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm,
                    remarkFrontmatter,
                    [
                        remarkObsidianImages as any,
                        {
                            mdDir,
                            allowedImages,
                            fileIndex,
                        },
                    ],
                    [
                        remarkWikiLink,
                        {
                            pageResolver: (raw: string) => {
                                const unescaped = raw
                                    .replace(/\\\|/g, "|")
                                    .replace(/\\\]/g, "]")
                                    .replace(/\\\[/g, "[");

                                const [pathWithSection] =
                                    unescaped.split("|");
                                const [pageName] =
                                    pathWithSection.split("#");

                                return [
                                    pageName
                                        .trim()
                                        .replace(/^\/+|\/+$/g, ""),
                                ];
                            },
                            hrefTemplate: (rawSlug: string) => {
                                const [pagePart, section] =
                                    rawSlug.split("#");
                                const realPath =
                                    manifest.slugMap[pagePart];

                                if (!realPath) {
                                    return `/__missing__/${encodeURIComponent(
                                        pagePart
                                    )}`;
                                }

                                if (section) {
                                    const fragment = section
                                        .trim()
                                        .toLowerCase()
                                        .replace(/[^\w\s-]/g, "")
                                        .replace(/\s+/g, "-");

                                    return `/page/${encodeURIComponent(
                                        pagePart
                                    )}#${fragment}`;
                                }

                                return `/page/${encodeURIComponent(
                                    pagePart
                                )}`;
                            },
                        },
                    ],
                ]}
                rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
                components={{
                    a: (props) => <WikiLink {...props} />,
                    hr: Divider,
                    blockquote: ({ node, children }) => {
                        const callout = renderCallout(
                            node,
                            Array.isArray(children) ? children : [children]
                        );
                        if (callout) return callout;

                        return (
                            <blockquote
                                className="my-6 pl-4 border-l-4 italic"
                                style={{
                                    borderColor:
                                        "var(--callout-quote-border)",
                                    background:
                                        "var(--callout-quote-bg)",
                                    color: "var(--callout-quote-text)",
                                }}
                            >
                                {children}
                            </blockquote>
                        );
                    },
                    ...createTableComponents(),
                    ...createListComponents(),
                    ...createHeadingComponents(),
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
};
