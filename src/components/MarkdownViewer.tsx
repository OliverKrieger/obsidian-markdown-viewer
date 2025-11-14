import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkWikiLink from "remark-wiki-link";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { useMarkdown } from "../hooks/useMarkdown";
import { useSlugMap } from "../hooks/useSlugMap";

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
                                // Split Obsidian alias: [[real|alias]]
                                const [realName] = raw.split("|");

                                return [
                                    realName
                                        .trim()
                                        .replace(/^\/+|\/+$/g, "") // remove slashes
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
                    a: ({ href, children, ...props }) => {
                        if (!href) return <a {...props}>{children}</a>;

                        const isMissing = href.startsWith("/__missing__/");

                        if (isMissing) {
                            const slug = decodeURIComponent(href.replace("/__missing__/", ""));
                            return (
                                <span
                                    className="text-red-400 underline decoration-red-400 cursor-not-allowed"
                                    title={`Page does not exist: ${slug}`}
                                >
                                    {children}
                                </span>
                            );
                        }

                        return (
                            <a
                                href={href}
                                className="text-blue-500 underline"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
};
