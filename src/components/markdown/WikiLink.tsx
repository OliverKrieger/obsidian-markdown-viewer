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

    // Flatten children into a single text string
    const rawText = flattenText(children).trim();

    // Alias extraction:
    // "Page|Alias" -> use Alias
    const alias = rawText.includes("|")
        ? rawText.split("|")[1].trim()
        : rawText;

    if (isMissing) {
        const slug = decodeURIComponent(href.replace("/__missing__/", ""));
        return (
            <span
                className="text-red-400 underline decoration-red-400 cursor-not-allowed"
                title={`Page does not exist: ${slug}`}
            >
                {alias}
            </span>
        );
    }

    return (
        <a
            href={href}
            className="text-blue-500 underline hover:text-blue-400"
            {...props}
        >
            {alias}
        </a>
    );
}
