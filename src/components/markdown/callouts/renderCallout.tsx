import { Callout } from "./Callout";
import type { ReactNode } from "react";

export function renderCallout(node: any, children: ReactNode[]) {
    if (!node.children?.length) return null;

    const firstChild = node.children[0];

    if (!firstChild?.children?.[0]?.value) return null;

    const text = firstChild.children[0].value.trim();

    // detect [!type] Title
    const match = text.match(/^\[!(?<type>[A-Za-z0-9_-]+)\]\s*(?<title>.*)?$/);

    if (!match?.groups) return null;

    const { type, title } = match.groups;

    // remove first line (the callout declaration)
    const content = children.slice(1);

    return (
        <Callout type={type.toLowerCase()} title={title}>
            {content}
        </Callout>
    );
}
