import { Callout } from "./Callout";
import type { ReactNode } from "react";

export function renderCallout(node: any, childrenArray: ReactNode[]) {
    // The callout declaration must be inside the first <p>
    const firstElement = node.children?.find(
        (child: any) => child.type === "element" && child.tagName === "p"
    );

    if (!firstElement) return null;

    const firstTextNode = firstElement.children?.find(
        (c: any) => c.type === "text"
    );

    if (!firstTextNode) return null;

    const text = firstTextNode.value.trim();

    // Detect e.g. [!lore], [!quote] Title
    const match = text.match(/^\[!(?<type>[\w-]+)\]\s*(?<title>.*)?$/i);
    if (!match?.groups) return null;

    const { type, title } = match.groups;

    // Remove the FIRST <p> from React children so [!lore] does not render
    const cleanedChildren = childrenArray.filter((child: any) => {
        // Drop paragraphs whose first text node IS the callout line
        if (
            child?.props?.children === text || 
            child?.props?.children?.[0] === text
        ) {
            return false;
        }
        return true;
    });

    return (
        <Callout type={type.toLowerCase()} title={title || undefined}>
            {cleanedChildren}
        </Callout>
    );
}
