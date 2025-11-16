import type { ReactNode } from "react";

type Props = { children?: ReactNode };

// H1
export function H1({ children }: Props) {
    return (
        <h1 className="heading-1 flex items-center gap-2 group">
            {children}
        </h1>
    );
}

// H2
export function H2({ children }: Props) {
    return (
        <h2 className="heading-2 pb-1">
            {children}
        </h2>
    );
}

// H3
export function H3({ children }: Props) {
    return <h3 className="heading-3">{children}</h3>;
}

// H4
export function H4({ children }: Props) {
    return <h4 className="heading-4">{children}</h4>;
}

// H5
export function H5({ children }: Props) {
    return <h5 className="heading-5">{children}</h5>;
}

// H6
export function H6({ children }: Props) {
    return <h6 className="heading-6">{children}</h6>;
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
