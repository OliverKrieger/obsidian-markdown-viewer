import { useParams } from "react-router-dom";
import { useSlugMap } from "../hooks/useSlugMap";
import { MarkdownViewer } from "../components/MarkdownViewer";
import { settings } from "../config/settings";

export function Page() {
    const { pageId } = useParams();
    const slugMap = useSlugMap();

    if (!slugMap) return <div className="p-6">Loading…</div>;
    if (!pageId) return <div className="p-6 text-red-500">Missing page ID.</div>;

    const realPath = slugMap[pageId];

    if (!realPath) {
        return (
            <div className="p-6 text-red-500">
                Unknown page: <b>{pageId}</b>
            </div>
        );
    }

    const mdPath = `${settings.contentRoot}/${realPath}`;
    return <MarkdownViewer path={mdPath} />;
}
