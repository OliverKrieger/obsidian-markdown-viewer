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
                                // Fix Obsidian table escapes: [[Page\|Alias]]
                                const cleaned = raw.replace(/\\\|/g, "|");

                                const [realName] = cleaned.split("|");

                                return [
                                    realName
                                        .trim()
                                        .replace(/^\/+|\/+$/g, "")
                                ];
                            },

                            hrefTemplate: (slug: string) => {
                                if (!slugMap) return "#";

                                const realPath = slugMap[slug];
                                if (!realPath) {
                                    console.warn("Slug not found:", slug);
                                    return `/__missing__/${encodeURIComponent(slug)}`;
                                }

                                return `/page/${encodeURIComponent(slug)}`;
                            },
                        },
                    ],
                ]}
                rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
                components={{
                    a: (props) => <WikiLink {...props} />,
                    hr: Divider,
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
