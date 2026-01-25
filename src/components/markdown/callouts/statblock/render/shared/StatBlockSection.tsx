import React from "react";

export function StatBlockSection({
    title,
    desc,
    children,
}: {
    title: string;
    desc?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mt-4">
            <h2 className="font-serif text-lg font-bold text-brand-500 border-b border-brand-500 pb-1 mb-2">
                {title}
            </h2>

            {desc ? (
                <p className="text-sm opacity-85 mb-2 whitespace-pre-wrap">
                    {desc}
                </p>
            ) : null}

            {children}
        </section>
    );
}
