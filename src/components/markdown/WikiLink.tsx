import type { AnchorHTMLAttributes, ReactNode } from "react";

interface WikiLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href?: string;
    children?: ReactNode;
}

function flattenText(node: ReactNode): string {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(flattenText).join("");
    if (typeof node === "number") return String(node);
    if (node && typeof node === "object" && "props" in node) {
        return flattenText((node as any).props.children);
    }
    return "";
}

export function WikiLink({ href, children, ...props }: WikiLinkProps) {
    if (!href) return <a {...props}>{children}</a>;

    const isMissing = href.startsWith("/__missing__/");

    const rawText = flattenText(children).trim();
    const alias = rawText.includes("|")
        ? rawText.split("|")[1].trim()
        : rawText;

    if (isMissing) {
        const slug = decodeURIComponent(href.replace("/__missing__/", ""));

        return (
            <a
                href={href}
                className="underline cursor-not-allowed"
                style={{ color: "#f87171" }} // error red
                title={`Page does not exist: ${slug}`}
                onClick={(e) => e.preventDefault()} // still blocks navigation
            >
                {alias}
            </a>
        );
    }

    // Normal link — color is handled by prose recipe (a / a:hover)
    return (
        <a
            href={href}
            className="underline decoration-1"
            {...props}
        >
            {alias}
        </a>
    );
}
