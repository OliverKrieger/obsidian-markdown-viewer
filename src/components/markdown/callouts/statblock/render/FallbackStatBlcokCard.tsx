// src/components/markdown/callouts/statblock/render/FallbackStatBlockCard.tsx
import React from "react";
import type { UnknownStatBlock } from "../types";

export const FallbackStatBlockCard: React.FC<UnknownStatBlock> = ({ title, ruleset, raw }) => {
    return (
        <section className="my-6 rounded-2xl border p-4 bg-white/60 shadow-sm">
            <div className="text-lg font-bold">{title}</div>
            <div className="text-sm opacity-70 mb-3">ruleset: {ruleset}</div>
            <pre className="text-sm whitespace-pre-wrap overflow-auto p-3 rounded-lg border bg-white/50">
                {raw}
            </pre>
        </section>
    );
};
