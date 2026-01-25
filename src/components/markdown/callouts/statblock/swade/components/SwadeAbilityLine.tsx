import type { ManifestLike, StatBlockAbilityRef } from "../../types";
import { SwadeAbilityRef } from "./SwadeAbilityRef";

export function SwadeAbilityLine({
    item,
    manifest,
    showDash = true,
}: {
    item: StatBlockAbilityRef;
    manifest?: ManifestLike;
    showDash?: boolean;
}) {
    return (
        <p className="text-sm">
            {showDash ? <span className="opacity-75">• </span> : null}
            <span className="font-semibold">{item.name}</span>
            {item.ref ? (
                <>
                    <span className="opacity-75"> — </span>
                    <SwadeAbilityRef refName={item.ref} manifest={manifest} />
                </>
            ) : null}
            {item.text ? <span className="opacity-75"> — {item.text}</span> : null}
        </p>
    );
}
