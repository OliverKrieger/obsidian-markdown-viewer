import { useMode } from "../hooks/useMode";
import { settings } from "../config/settings";
import { useSlugMap } from "../hooks/useSlugMap";
import { MarkdownViewer } from "../components/MarkdownViewer";

export function Home() {
    const mode = useMode();
    const slugMap = useSlugMap();

    if (!slugMap) return <div>Loading…</div>;

    // Use slug, not path
    const slug = settings.defaultPageByMode[mode];
    const realPath = slugMap[slug];

    if (!realPath) {
        return <div className="p-6 text-red-500">Default page not found: {slug}</div>;
    }

    return (
        <MarkdownViewer path={`/content/${realPath}`} />
    );
}
