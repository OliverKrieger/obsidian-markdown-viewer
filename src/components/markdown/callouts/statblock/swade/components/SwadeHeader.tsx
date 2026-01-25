import { WildCardBadge } from "../../render/Shared";

export function SwadeHeader({
    title,
    type,
    desc,
    wildCard,
}: {
    title: string;
    type?: string;
    desc?: string;
    wildCard: boolean;
}) {
    return (
        <>
            {wildCard ? <WildCardBadge /> : null}

            <header className="text-center mb-4">
                <h1 className="font-serif text-2xl font-bold text-brand-500 tracking-wide">{title}</h1>
                {type ? <p className="text-sm text-muted-foreground italic">{type}</p> : null}
                {wildCard ? (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-brand-500/20 text-brand-500 rounded">
                        Wild Card
                    </span>
                ) : null}
            </header>

            {desc ? (
                <p className="text-sm text-muted-foreground italic text-center mb-4 whitespace-pre-wrap">
                    {desc}
                </p>
            ) : null}
        </>
    );
}
