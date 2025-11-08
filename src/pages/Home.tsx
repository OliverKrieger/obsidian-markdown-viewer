import { settings } from '../config/settings';
import { MarkdownViewer } from '../components/MarkdownViewer';

export function Home() {
    return <MarkdownViewer path={`${settings.contentRoot}/${settings.defaultPage}`} />;
}