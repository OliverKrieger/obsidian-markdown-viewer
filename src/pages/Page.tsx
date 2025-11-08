import { useParams } from 'react-router-dom';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { settings } from '../config/settings';

export function Page() {
    const { pageId } = useParams();
    const mdPath = `${settings.contentRoot}/${pageId}.md`;
    return <MarkdownViewer path={mdPath} />;
}