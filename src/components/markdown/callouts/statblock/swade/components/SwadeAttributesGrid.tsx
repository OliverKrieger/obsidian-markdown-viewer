import { AttributeBox } from "../../render/Shared";

export function SwadeAttributesGrid({
    agi,
    sma,
    spi,
    str,
    vig,
}: {
    agi: string;
    sma: string;
    spi: string;
    str: string;
    vig: string;
}) {
    return (
        <div className="mb-4">
            <h2 className="font-serif text-sm font-bold text-brand-500 uppercase tracking-wider mb-2 text-center">
                Attributes
            </h2>
            <div className="grid grid-cols-5 gap-2">
                <AttributeBox label="Agi" value={agi} />
                <AttributeBox label="Sma" value={sma} />
                <AttributeBox label="Spi" value={spi} />
                <AttributeBox label="Str" value={str} />
                <AttributeBox label="Vig" value={vig} />
            </div>
        </div>
    );
}
