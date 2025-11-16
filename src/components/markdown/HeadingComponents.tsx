import type { ReactNode } from "react";

type Props = { children?: ReactNode };

// H1
export function H1({ children }: Props) {
    return (
        <h1
            className="
                text-4xl font-extrabold tracking-tight
                mb-6 mt-10 scroll-mt-24
                group flex items-center gap-2
            "
            style={{ color: "var(--tw-prose-headings)" }}
        >
            {children}
        </h1>
    );
}

// H2
export function H2({ children }: Props) {
    return (
        <h2
            className="
                text-3xl font-bold tracking-tight
                mt-10 mb-4 pb-1 scroll-mt-24
                border-b border-zinc-700
            "
            style={{ color: "var(--tw-prose-headings)" }}
        >
            {children}
        </h2>
    );
}

// H3
export function H3({ children }: Props) {
    return (
        <h3
            className="
                text-2xl font-semibold
                mt-8 mb-3 scroll-mt-20
            "
            style={{ color: "var(--tw-prose-headings)" }}
        >
            {children}
        </h3>
    );
}

// H4
export function H4({ children }: Props) {
    return (
        <h4
            className="
                text-xl font-semibold
                mt-6 mb-2 scroll-mt-20
            "
            style={{ color: "var(--tw-prose-headings)" }}
        >
            {children}
        </h4>
    );
}

// H5
export function H5({ children }: Props) {
    return (
        <h5
            className="
                text-lg font-medium
                mt-4 mb-1 scroll-mt-16
            "
            style={{ color: "var(--tw-prose-headings)" }}
        >
            {children}
        </h5>
    );
}

// H6
export function H6({ children }: Props) {
    return (
        <h6
            className="
                text-base font-medium uppercase tracking-wide
                mt-3 mb-1 scroll-mt-16
            "
            style={{ color: "var(--tw-prose-headings)" }}
        >
            {children}
        </h6>
    );
}

export function createHeadingComponents() {
    return {
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        h5: H5,
        h6: H6,
    };
}
