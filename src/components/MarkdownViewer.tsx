import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkWikiLink from 'remark-wiki-link';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { useMarkdown } from '../hooks/useMarkdown';

interface Props {
    path: string;
}

export const MarkdownViewer: React.FC<Props> = ({ path }) => {
    const { content, error } = useMarkdown(path);

    if (error) return <div className="text-red-500">Error loading file: {error}</div>;
    if (!content) return <div className="text-gray-400">Loading...</div>;

    return (
        <article className="prose dark:prose-invert max-w-none p-6">
            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm,
                    remarkFrontmatter,
                    [remarkWikiLink, { hrefTemplate: (permalink: string) => `/page/${permalink}` }],
                ]}
                rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
};
