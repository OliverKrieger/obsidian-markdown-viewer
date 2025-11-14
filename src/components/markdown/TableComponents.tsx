import type { ReactNode } from "react";

// Shared prop type
type Props = { children?: ReactNode };

export function Table({ children }: Props) {
    return (
        <table className="min-w-full my-6 bg-zinc-900/60 shadow-sm rounded-lg overflow-hidden text-sm">
            {children}
        </table>
    );
}

export function Thead({ children }: Props) {
    return (
        <thead className="bg-zinc-800/80 text-zinc-100 border-b border-zinc-700">
            {children}
        </thead>
    );
}

export function Th({ children }: Props) {
    return (
        <th className="px-4 py-2 text-left font-medium">
            {children}
        </th>
    );
}

export function Tbody({ children }: Props) {
    return (
        <tbody className="divide-y divide-zinc-800">
            {children}
        </tbody>
    );
}

export function Tr({ children }: Props) {
    return (
        <tr className="even:bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
            {children}
        </tr>
    );
}

export function Td({ children }: Props) {
    return (
        <td className="px-4 py-2 align-top text-zinc-300">
            {children}
        </td>
    );
}

/**
 * Return a valid ReactMarkdown components override object.
 *
 * Must return an object with table-related HTML tag keys.
 */
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
