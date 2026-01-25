import type { Dnd5eAction, ManifestLike } from "../../types";
import { AbilityRef } from "../../render/shared/AbilityRef";

export function Dnd5eActionLine({
    item,
    manifest,
}: {
    item: Dnd5eAction;
    manifest?: ManifestLike;
}) {
    return (
        <p className="text-sm">
            <span className="font-semibold italic text-brand-500">{item.name}.</span>{" "}
            {item.ref ? <AbilityRef refName={item.ref} manifest={manifest} /> : null}
            {item.text ? <span className="opacity-90"> {item.text}</span> : null}
        </p>
    );
}
