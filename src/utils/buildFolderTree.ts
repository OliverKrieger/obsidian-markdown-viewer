import { naturalSort } from "./naturalSort";

export interface TreeNode {
    name: string;
    folders: TreeNode[];
    files: string[];
}

export function buildFolderTree(entries: [string, string][]): TreeNode[] {
    const root: TreeNode[] = [];

    function ensureFolder(level: TreeNode[], name: string): TreeNode {
        let folder = level.find((x) => x.name === name);
        if (!folder) {
            folder = { name, folders: [], files: [] };
            level.push(folder);
        }
        return folder;
    }

    for (const [slug, filePath] of entries) {
        const parts = filePath.split("/");

        parts.pop()!.replace(/\.md$/i, ""); // remove filename as we only want folders
        const folderParts = parts;

        let level = root;
        let parent: TreeNode | null = null;

        for (const folderName of folderParts) {
            const folder = ensureFolder(level, folderName);
            parent = folder;
            level = folder.folders;
        }

        // If parent is null → file is at root level
        if (parent) {
            parent.files.push(slug);
        } else {
            // root-level file
            let rootFolder = ensureFolder(root, "_root");
            rootFolder.files.push(slug);
        }
    }

    // Sort everything
    function sortTree(nodes: TreeNode[]) {
        nodes.sort((a, b) => naturalSort(a.name, b.name));
        for (const n of nodes) {
            n.files.sort(naturalSort);
            sortTree(n.folders);
        }
    }

    sortTree(root);

    return root;
}
