import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const VAULT_PATH = process.env.VITE_VAULT_PATH;
const PLAYER_FOLDER = process.env.VITE_PLAYER_FOLDER || "Player Section";
const DM_FOLDER = process.env.VITE_DM_FOLDER || "DM Section";

if (!VAULT_PATH) {
    console.error("❌ Missing VITE_VAULT_PATH in .env.development");
    process.exit(1);
}

const DEST_ROOT = path.resolve("public/content");

// -------------------------
// CLEAN CONTENT DIR
// -------------------------
if (fs.existsSync(DEST_ROOT)) {
    console.log("[INFO] Cleaning public/content…");
    fs.rmSync(DEST_ROOT, { recursive: true });
}
fs.mkdirSync(DEST_ROOT, { recursive: true });

// -------------------------
// Helpers
// -------------------------

function slugify(name) {
    return name
        .replace(/\.md$/i, "")
        .replace(/_/g, " ")
        .trim();
}

// Extract Obsidian wiki links ([[Foo|Alias]], [[Foo#Bar]])
function extractWikiLinks(markdown) {
    const matches = markdown.match(/\[\[([^\]]+)\]\]/g) || [];
    return matches.map((m) => {
        const inner = m.slice(2, -2);
        return inner.split("|")[0].split("#")[0].trim();
    });
}

// Extract markdown + obsidian images
function extractImageLinks(markdown) {
    const results = new Set();

    // Markdown images: ![alt](path)
    const mdMatches = markdown.match(/!\[[^\]]*]\(([^)]+)\)/g) || [];
    mdMatches.forEach((m) => {
        const link = m.match(/\(([^)]+)\)/)[1];
        results.add(link.trim());
    });

    // Obsidian images: ![[image.png]]
    const obsMatches = markdown.match(/!\[\[([^\]]+)\]\]/g) || [];
    obsMatches.forEach((m) => {
        const inner = m.slice(3, -2); // remove ![[ ]]
        const file = inner.split("|")[0];
        results.add(file.trim());
    });

    return [...results];
}

// Determine whether file is player-only, dm-only, or global
function classifyFile(relPath) {
    const norm = relPath.replace(/\\/g, "/");

    if (norm === PLAYER_FOLDER || norm.startsWith(`${PLAYER_FOLDER}/`))
        return "player";

    if (norm === DM_FOLDER || norm.startsWith(`${DM_FOLDER}/`))
        return "dm";

    return "global"; // DM-only
}

// -------------------------
// Data containers
// -------------------------
const slugMapPlayer = {};
const slugMapDM = {};
const linksFromPlayer = new Set();
const linksFromDM = new Set();
const imageRefsForFile = {}; // mdRelPath -> [image paths]

// -------------------------
// Copy + index build
// -------------------------
function walkAndCopy(srcDir, rel = "") {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const relPath = rel ? path.join(rel, entry.name) : entry.name;
        const destPath = path.join(DEST_ROOT, relPath);

        if (entry.isDirectory()) {
            if (entry.name === ".obsidian") continue;

            fs.mkdirSync(destPath, { recursive: true });
            walkAndCopy(srcPath, relPath);
            continue;
        }

        // Copy all files (images, PDFs, etc.)
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);

        if (!entry.name.toLowerCase().endsWith(".md")) continue;

        // Process markdown
        const role = classifyFile(relPath);
        const raw = fs.readFileSync(srcPath, "utf8");
        const slug = slugify(entry.name);
        const normRel = relPath.replace(/\\/g, "/");

        const wikiLinks = extractWikiLinks(raw);
        const imageLinks = extractImageLinks(raw);

        imageRefsForFile[normRel] = imageLinks;

        if (role === "player") slugMapPlayer[slug] = normRel;
        if (role === "player" || role === "dm" || role === "global") {
            slugMapDM[slug] = normRel;
        }

        // Track link references
        if (role === "player") wikiLinks.forEach((l) => linksFromPlayer.add(l));
        wikiLinks.forEach((l) => linksFromDM.add(l));
    }
}

// -------------------------
// Run copy
// -------------------------
console.log(`📁 Copying vault "${VAULT_PATH}" → public/content …`);
walkAndCopy(VAULT_PATH);

// -------------------------
// Determine missing links
// -------------------------
const playerExisting = new Set(Object.keys(slugMapPlayer));
const dmExisting = new Set(Object.keys(slugMapDM));

const missingPlayer = [...linksFromPlayer]
    .filter((slug) => !playerExisting.has(slug))
    .sort();

const missingDM = [...linksFromDM]
    .filter((slug) => !dmExisting.has(slug))
    .sort();

// -------------------------
// Build image lists for manifest
// -------------------------
function collectImagesForManifest(slugMap) {
    const allowed = new Set();
    for (const mdRel of Object.values(slugMap)) {
        const imgs = imageRefsForFile[mdRel] || [];
        imgs.forEach((imgPath) => allowed.add(imgPath));
    }
    return [...allowed];
}

const playerImages = collectImagesForManifest(slugMapPlayer);
const dmImages = collectImagesForManifest(slugMapDM);

// -------------------------
// Write manifests
// -------------------------
fs.writeFileSync(
    path.join(DEST_ROOT, "player-manifest.json"),
    JSON.stringify(
        {
            mode: "player",
            playerFolder: PLAYER_FOLDER,
            slugMap: slugMapPlayer,
            images: playerImages,
            missing: missingPlayer,
        },
        null,
        2
    )
);

fs.writeFileSync(
    path.join(DEST_ROOT, "dm-manifest.json"),
    JSON.stringify(
        {
            mode: "dm",
            playerFolder: PLAYER_FOLDER,
            dmFolder: DM_FOLDER,
            slugMap: slugMapDM,
            images: dmImages,
            missing: missingDM,
        },
        null,
        2
    )
);

console.log("✅ Content build complete.");
console.log(`   Player pages:  ${Object.keys(slugMapPlayer).length}`);
console.log(`   DM pages:      ${Object.keys(slugMapDM).length}`);
console.log(`   Player images: ${playerImages.length}`);
console.log(`   DM images:     ${dmImages.length}`);
console.log(`   Missing (Player): ${missingPlayer.length}`);
console.log(`   Missing (DM):     ${missingDM.length}`);
