import React from "react";

export function StatDivider() {
    return (
        <div className="relative h-1 my-2">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-brand-500 to-transparent opacity-60" />
            <svg className="w-full h-1" preserveAspectRatio="none">
                <line
                    x1="0"
                    y1="50%"
                    x2="100%"
                    y2="50%"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-brand-500"
                />
            </svg>
        </div>
    );
}

export function DiamondDivider() {
    return (
        <div className="flex items-center justify-center my-3">
            <div className="flex-1 h-px bg-linear-to-r from-transparent to-brand-500/50" />
            <div className="w-2 h-2 rotate-45 bg-brand-500 mx-2" />
            <div className="flex-1 h-px bg-linear-to-l from-transparent to-brand-500/50" />
        </div>
    );
}

export function OrnamentBorder() {
    return (
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 pointer-events-none">
            {/* Corner ornaments */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-500" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-brand-500" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-500" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-brand-500" />
        </div>
    );
}

export function WildCardBadge() {
    return (
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-tertiary-100 rounded-full flex items-center justify-center shadow-md border-2 border-tertiary-500">
            <svg className="w-6 h-6 text-tertiary-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
        </div>
    );
}

export function AttributeBox({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex flex-col items-center p-2 bg-secondary-500/20 rounded border border-brand-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
            <span className="font-serif text-lg font-bold text-brand-500">{value}</span>
        </div>
    );
}

export function StatPill({
    label,
    value,
    subValue,
}: {
    label: string;
    value: React.ReactNode;
    subValue?: React.ReactNode;
}) {
    return (
        <div className="text-center p-2 bg-brand-500/10 rounded">
            <span className="block text-xs uppercase text-muted-foreground">{label}</span>
            <span className="font-bold text-brand-500">
                {value}
                {subValue != null && <span className="text-xs">{subValue}</span>}
            </span>
        </div>
    );
}
