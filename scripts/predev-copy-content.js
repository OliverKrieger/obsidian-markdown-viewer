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
// Clean content dir
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
    return name.replace(/\.md$/i, "").replace(/_/g, " ").trim();
}

function extractWikiLinks(markdown) {
    const matches = markdown.match(/\[\[([^\]]+)\]\]/g) || [];
    return matches.map((m) => {
        const inner = m.slice(2, -2);
        return inner.split("|")[0].split("#")[0].trim();
    });
}

function extractRawImageTargets(markdown) {
    const results = [];

    const mdMatches = markdown.match(/!\[[^\]]*]\(([^)]+)\)/g) || [];
    mdMatches.forEach((m) => {
        const link = m.match(/\(([^)]+)\)/)[1];
        results.push(link.trim());
    });

    const obsMatches = markdown.match(/!\[\[([^\]]+)\]\]/g) || [];
    obsMatches.forEach((m) => {
        const inner = m.slice(3, -2);
        const file = inner.split("|")[0];
        results.push(file.trim());
    });

    return results;
}

function classifyFile(relPath) {
    const norm = relPath.replace(/\\/g, "/");
    if (norm === PLAYER_FOLDER || norm.startsWith(`${PLAYER_FOLDER}/`)) return "player";
    if (norm === DM_FOLDER || norm.startsWith(`${DM_FOLDER}/`)) return "dm";
    return "global";
}

// -------------------------
// DATA STRUCTURES
// -------------------------
const allMarkdownFiles = []; // [{relPath, fullPath}]
const fileIndex = {};        // filename -> [relPaths]

const slugMapPlayer = {};
const slugMapDM = {};

const linksFromPlayer = new Set();
const linksFromDM = new Set();

const imageRefsForFile = {}; // mdRelPath -> [imageRelPaths]

// -------------------------
// PASS 1 — Copy and Index
// -------------------------
console.log(`📁 Copying vault "${VAULT_PATH}" → public/content …`);

function pass1(srcDir, rel = "") {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const relPath = rel ? path.join(rel, entry.name) : entry.name;
        const destPath = path.join(DEST_ROOT, relPath);

        if (entry.isDirectory()) {
            if (entry.name === ".obsidian") continue;
            fs.mkdirSync(destPath, { recursive: true });
            pass1(srcPath, relPath);
            continue;
        }

        // Copy file now
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);

        const normRel = relPath.replace(/\\/g, "/");

        if (entry.name.toLowerCase().endsWith(".md")) {
            // markdown recorded for pass 2
            allMarkdownFiles.push({
                relPath: normRel,
                fullPath: srcPath,
            });
        } else {
            // index all other files
            if (!fileIndex[entry.name]) fileIndex[entry.name] = [];
            fileIndex[entry.name].push(normRel);
        }
    }
}

pass1(VAULT_PATH);

// -------------------------
// PASS 2 — Process Markdown
// -------------------------
function resolveImageTargets(mdRelPath, rawTargets) {
    const mdDir = path.dirname(mdRelPath).replace(/\\/g, "/");
    const resolved = new Set();

    for (const target of rawTargets) {
        if (!target || target.startsWith("http://") || target.startsWith("https://"))
            continue;

        let cleaned = target.replace(/^\.\//, "").replace(/^\/+/, "");
        let candidateRel;

        if (cleaned.includes("/")) {
            candidateRel = path
                .normalize(path.join(mdDir, cleaned))
                .replace(/\\/g, "/");
        } else {
            const candidates = fileIndex[cleaned] || [];
            if (candidates.length === 1) {
                candidateRel = candidates[0];
            } else if (candidates.length > 1) {
                const sameDir = candidates.find((c) => c.startsWith(mdDir));
                candidateRel = sameDir || candidates[0];
            } else {
                continue;
            }
        }

        resolved.add(candidateRel);
    }

    return [...resolved];
}

console.log("[INFO] Processing markdown for links + embeds…");

for (const { relPath, fullPath } of allMarkdownFiles) {
    const role = classifyFile(relPath);
    const content = fs.readFileSync(fullPath, "utf8");
    const slug = slugify(path.basename(relPath));

    const wikiLinks = extractWikiLinks(content);
    const rawImages = extractRawImageTargets(content);
    const resolvedImages = resolveImageTargets(relPath, rawImages);

    imageRefsForFile[relPath] = resolvedImages;

    if (role === "player") slugMapPlayer[slug] = relPath;
    slugMapDM[slug] = relPath;

    if (role === "player") {
        wikiLinks.forEach((l) => linksFromPlayer.add(l));
    }
    wikiLinks.forEach((l) => linksFromDM.add(l));
}

// -------------------------
// Missing Pages
// -------------------------
const existingPlayer = new Set(Object.keys(slugMapPlayer));
const existingDM = new Set(Object.keys(slugMapDM));

const missingPlayer = [...linksFromPlayer].filter((slug) => !existingPlayer.has(slug)).sort();
const missingDM = [...linksFromDM].filter((slug) => !existingDM.has(slug)).sort();

// -------------------------
// Collect Images Used
// -------------------------
function collectImages(slugMap) {
    const set = new Set();
    for (const relPath of Object.values(slugMap)) {
        (imageRefsForFile[relPath] || []).forEach((i) => set.add(i));
    }
    return [...set];
}

const playerImages = collectImages(slugMapPlayer);
const dmImages = collectImages(slugMapDM);

// -------------------------
// Write Manifests
// -------------------------
fs.writeFileSync(
    path.join(DEST_ROOT, "player-manifest.json"),
    JSON.stringify(
        {
            mode: "player",
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
