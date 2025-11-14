import type { AnchorHTMLAttributes, ReactNode } from "react";

type WikiLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href?: string;
    children?: ReactNode;
};

export function WikiLink({ href, children, ...props }: WikiLinkProps) {
    if (!href) {
        return <a {...props}>{children}</a>;
    }

    // Missing link → Obsidian-style red link
    if (href.startsWith("/__missing__/")) {
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

    // Normal link
    return (
        <a
            href={href}
            className="text-blue-500 underline"
            {...props}
        >
            {children}
        </a>
    );
}
