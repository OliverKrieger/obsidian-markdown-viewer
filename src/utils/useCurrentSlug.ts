import { useParams } from "react-router-dom";

export function useCurrentSlug() {
    const { pageId } = useParams();
    return pageId || null;
}