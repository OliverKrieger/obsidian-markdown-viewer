import 'react-markdown';

declare module "react-markdown/lib/ast-to-react" {
    interface Components {
        "grid-map"?: React.ComponentType<any>;
    }
}

declare module "react-markdown" {
    interface ExtraProps {
        "grid-map"?: any;
    }
}

declare module "hast" {
    interface Element {
        tagName: string;
        properties: Record<string, any>;
    }
}