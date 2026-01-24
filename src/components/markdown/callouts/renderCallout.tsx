// src/components/markdown/callouts/renderCallout.tsx
import { Callout } from "./Callout";
import type { ReactNode } from "react";
import { FigureCallout } from "./FigureCallout";
import { parseFigureCallout } from "./parseFigureCallout";
import { parseStatBlockCallout } from "./statblock/parseStatBlockCallout";
import { getStatBlockRenderer } from "./statblock/renderers";

type ManifestLike = {
    slugMap: Record<string, string>;
    pageMeta?: Record<string, any>;
};

export function createRenderCallout(ctx: { manifest?: ManifestLike }) {
    return function renderCallout(node: any, childrenArray: ReactNode[]) {
        const firstElement = node.children?.find(
            (child: any) => child.type === "element" && child.tagName === "p"
        );
        if (!firstElement) return null;

        // Build header text by reading the first <p> plain-text
        const firstTextNode = firstElement.children?.find((c: any) => c.type === "text");
        if (!firstTextNode) return null;

        const text = firstTextNode.value.trim();

        const match = text.match(/^\[!(?<type>[\w-]+)\]\s*(?<title>.*)?$/i);
        if (!match?.groups) return null;

        const { type, title } = match.groups;
        const typeKey = type.toLowerCase();

        const cleanedChildren = childrenArray.filter((child: any) => {
            if (child?.props?.children === text || child?.props?.children?.[0] === text) return false;
            return true;
        });

        if (typeKey === "figure" || typeKey === "image" || typeKey === "media") {
            const params = parseFigureCallout(node, text);
            return (
                <FigureCallout
                    title={title || undefined}
                    src={params.src}
                    alt={params.alt}
                    caption={params.caption}
                    align={params.align}
                    width={params.width}
                    className={params.className}
                    variant={params.variant}
                    href={params.href}
                />
            );
        }

        if (typeKey === "statblock") {
            const parsed = parseStatBlockCallout(node, text, title || "Stat Block");
            const Renderer = getStatBlockRenderer(parsed.ruleset);
            return <Renderer {...(parsed as any)} manifest={ctx.manifest} />;
        }

        return (
            <Callout type={typeKey} title={title || undefined}>
                {cleanedChildren}
            </Callout>
        );
    };
}
