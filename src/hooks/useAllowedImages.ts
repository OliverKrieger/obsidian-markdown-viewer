import { useManifest } from "./useManifest";

export function useAllowedImages(): string[] {
    const manifest = useManifest();
    return manifest?.images ?? [];
}
