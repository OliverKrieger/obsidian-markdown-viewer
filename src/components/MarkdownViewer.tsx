import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkWikiLink from "remark-wiki-link";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { useMarkdown } from "../hooks/useMarkdown";
import { useSlugMap } from "../hooks/useSlugMap";

// Helper Components
import { WikiLink } from "./markdown/WikiLink";
import { createTableComponents } from "./markdown/TableComponents";
import { createListComponents } from "./markdown/ListComponents";
import { createHeadingComponents } from "./markdown/HeadingComponents";
import { Divider } from "./markdown/Divider";
import { Blockquote } from "./markdown/Blockquote";
import { renderCallout } from "./markdown/callouts/renderCallout";

export const MarkdownViewer = ({ path }: { path: string }) => {
    const { content, error } = useMarkdown(path);
    const slugMap = useSlugMap();

    if (!slugMap) return <div className="p-6">Loading index…</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
    if (!content) return <div className="p-6">Loading…</div>;

    return (
        <article className="prose dark:prose-invert max-w-none p-6">
            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm,
                    remarkFrontmatter,
                    [
                        remarkWikiLink,
                        {
                            pageResolver: (raw: string) => {
                                // Normalize Obsidian escapes: [[Page\|Alias]] → [[Page|Alias]]
                                const unescaped = raw.replace(/\\\|/g, "|").replace(/\\\]/g, "]").replace(/\\\[/g, "[");

                                // Split alias: [[page|alias]] or [[page#section|alias]]
                                const [pathWithSection] = unescaped.split("|");

                                // Split heading: [[page#section]]
                                const [pageName] = pathWithSection.split("#");

                                return [
                                    pageName
                                        .trim()
                                        .replace(/^\/+|\/+$/g, "")
                                ];
                            },

                            hrefTemplate: (rawSlug: string) => {
                                if (!slugMap) return "#";

                                // Detect page#heading (Obsidian-style)
                                const [pagePart, section] = rawSlug.split("#");

                                const realPath = slugMap[pagePart];
                                if (!realPath) {
                                    return `/__missing__/${encodeURIComponent(pagePart)}`;
                                }

                                // If linking to a heading within the same page
                                if (section) {
                                    const fragment = section
                                        .trim()
                                        .toLowerCase()
                                        .replace(/[^\w\s-]/g, "")
                                        .replace(/\s+/g, "-");

                                    return `/page/${encodeURIComponent(pagePart)}#${fragment}`;
                                }

                                // Normal link
                                return `/page/${encodeURIComponent(pagePart)}`;
                            },
                        },
                    ],
                ]}
                rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
                components={{
                    a: (props) => <WikiLink {...props} />,
                    hr: Divider,
                    blockquote: ({ node, children }) => {
                        const callout = renderCallout(node, Array.isArray(children) ? children : [children]);
                        if (callout) return callout;

                        return (
                            <blockquote className="border-l-4 border-zinc-600 pl-4 italic my-6 text-zinc-400">
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
