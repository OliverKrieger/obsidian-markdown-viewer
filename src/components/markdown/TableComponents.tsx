import type { ReactNode } from "react";

type Props = { children?: ReactNode };

export function Table({ children }: Props) {
    return <table className="table-base">{children}</table>;
}

export function Thead({ children }: Props) {
    return <thead className="table-head">{children}</thead>;
}

export function Th({ children }: Props) {
    return (
        <th className="table-cell text-left font-medium">
            {children}
        </th>
    );
}

export function Tbody({ children }: Props) {
    return <tbody>{children}</tbody>;
}

export function Tr({ children }: Props) {
    return (
        <tr
            className="
                table-row
                even:bg-secondary-100/40
                dark:even:bg-secondary-900/30
                hover:bg-secondary-100/60
                dark:hover:bg-secondary-900/50
            "
        >
            {children}
        </tr>
    );
}

export function Td({ children }: Props) {
    return <td className="table-cell align-top">{children}</td>;
}

export function createTableComponents() {
    return {
        table: Table,
        thead: Thead,
        th: Th,
        tbody: Tbody,
        tr: Tr,
        td: Td,
    };
}
