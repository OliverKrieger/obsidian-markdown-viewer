import type { ReactNode } from "react";

type Props = { children?: ReactNode };

export function Ul({ children }: Props) {
    return <ul className="list-ul">{children}</ul>;
}

export function Ol({ children }: Props) {
    return <ol className="list-ol">{children}</ol>;
}

export function Li({ children }: Props) {
    return <li className="leading-relaxed">{children}</li>;
}

export function createListComponents() {
    return {
        ul: Ul,
        ol: Ol,
        li: Li,
    };
}
