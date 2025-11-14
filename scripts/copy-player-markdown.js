import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const playerFolder = process.env.VITE_PLAYER_MARKDOWN_PATH;
const destFolder = path.resolve("public/content/Player");
const indexFile = path.join(destFolder, "index.json");

if (!playerFolder) {
    console.error("❌ Missing VITE_PLAYER_MARKDOWN_PATH in .env.development");
    process.exit(1);
}

const slugMap = {};

function slugify(name) {
    return name
        .replace(/\.md$/, "")     // remove extension
        .replace(/_/g, " ")       // optional: convert 01_Regions → 01 Regions
        .trim();
}

function walkAndCopy(src, dest, rel = "") {
    fs.mkdirSync(dest, { recursive: true });

    for (const entry of fs.readdirSync(src)) {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);
        const stats = fs.statSync(srcPath);

        if (stats.isDirectory()) {
            walkAndCopy(srcPath, destPath, path.join(rel, entry));
            continue;
        }

        if (!entry.endsWith(".md")) continue;

        // Copy file
        fs.copyFileSync(srcPath, destPath);

        // Build slug map
        const realPath = path.join(rel, entry).replace(/\\/g, "/");
        const cleanSlug = slugify(entry);
        slugMap[cleanSlug] = realPath;
    }
}

console.log(`📁 Copying markdown from ${playerFolder}`);
walkAndCopy(playerFolder, destFolder);

console.log("🧭 Writing index.json...");
fs.writeFileSync(indexFile, JSON.stringify(slugMap, null, 2));

console.log("✅ Done!");
