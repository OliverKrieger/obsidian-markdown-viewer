import 'dotenv/config';
import fs from "fs";
import path from "path";

const playerFolder = process.env.VITE_PLAYER_MARKDOWN_PATH;
if (!playerFolder) {
    console.error("❌ Missing VITE_PLAYER_MARKDOWN_PATH in your .env.development");
    process.exit(1);
}

const destFolder = path.resolve("public/content/Player");

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);
        const stats = fs.statSync(srcPath);
        if (stats.isDirectory()) copyRecursive(srcPath, destPath);
        else if (entry.endsWith(".md")) fs.copyFileSync(srcPath, destPath);
    }
}

console.log(`📁 Copying markdown from ${playerFolder} to ${destFolder}...`);
copyRecursive(playerFolder, destFolder);
console.log("✅ Markdown copied successfully!");
