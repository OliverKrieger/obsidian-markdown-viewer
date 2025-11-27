import { visit } from "unist-util-visit";

export function remarkGridMap() {
    return (tree: any) => {
        visit(tree, "blockquote", (node, index, parent) => {
            if (!node.children?.length) return;

            const first = node.children[0];
            const firstText =
                first?.children?.[0]?.value?.trim?.() ?? "";

            if (firstText !== "[!grid-map]") return;

            const props = {
                title: "",
                map: "",
                rows: 0,
                cols: 0,
                prefix: "",
                cells: [] as string[],
            };

            const lines = extractTextLines(node.children.slice(1));

            for (const line of lines) {
                if (/^# /.test(line)) {
                    props.title = line.replace(/^# /, "").trim();
                } else if (/^map:/i.test(line)) {
                    const match = line.match(/\!\[\[(.*?)\]\]/);
                    if (match) props.map = match[1];
                } else if (/^rows:/i.test(line)) {
                    props.rows = Number(line.replace(/rows:/i, "").trim());
                } else if (/^cols:/i.test(line)) {
                    props.cols = Number(line.replace(/cols:/i, "").trim());
                } else if (/^prefix:/i.test(line)) {
                    props.prefix = line.replace(/prefix:/i, "").trim();
                } else if (/^- /.test(line)) {
                    props.cells.push(line.replace(/^- /, "").trim());
                }
            }
            
            if (index === undefined || !parent) return;

            parent.children[index] = {
                type: "gridMap",
                data: props,
            };
        });
    };
}

function extractTextLines(children: any[]) {
    const result: string[] = [];

    for (const node of children) {
        if (node.type === "paragraph") {
            const text = node.children
                .map((n: any) => n.value ?? "")
                .join("")
                .trim();

            if (text) result.push(text);
        }

        if (node.type === "list") {
            for (const item of node.children) {
                const t = item.children[0].children
                    .map((n: any) => n.value ?? "")
                    .join("")
                    .trim();

                if (t) result.push(`- ${t}`);
            }
        }
    }

    return result;
}
