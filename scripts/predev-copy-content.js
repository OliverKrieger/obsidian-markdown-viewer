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

// --- CLEAN PUBLIC/CONTENT ---
if (fs.existsSync(DEST_ROOT)) {
    console.log("[INFO] Cleaning public/content...");
    fs.rmSync(DEST_ROOT, { recursive: true });
}
fs.mkdirSync(DEST_ROOT, { recursive: true });

// --- Utilities ---

function slugify(name) {
    return name
        .replace(/\.md$/i, "") // remove extension
        .replace(/_/g, " ")    // 01_Regions -> 01 Regions
        .trim();
}

/**
 * Extract Obsidian-style wiki links: [[Page]], [[Page#Section]], [[Page|Alias]]
 */
function extractWikiLinks(markdown) {
    const matches = markdown.match(/\[\[([^\]]+)\]\]/g) || [];
    return matches.map((link) => {
        const inner = link.slice(2, -2); // strip [[ ]]
        // Page part = before | and before #
        return inner.split("|")[0].split("#")[0].trim();
    });
}

/**
 * Determine which "mode" a file belongs to based on its relative path:
 * - "player": under Player Section
 * - "dm": under DM Section
 * - "global": everywhere else (DM can see, Player cannot)
 */
function classifyFile(relPath) {
    const norm = relPath.replace(/\\/g, "/");

    if (
        norm === PLAYER_FOLDER ||
        norm.startsWith(`${PLAYER_FOLDER}/`)
    ) {
        return "player";
    }

    if (
        norm === DM_FOLDER ||
        norm.startsWith(`${DM_FOLDER}/`)
    ) {
        return "dm";
    }

    return "global"; // DM only
}

// --- Data structures ---

const slugMapPlayer = {};        // slug -> relPath (Player-only)
const slugMapDM = {};            // slug -> relPath (DM sees all)
const linksFromPlayer = new Set();
const linksFromDM = new Set();

// --- Main walker ---

function walkAndCopy(srcDir, rel = "") {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const relPath = rel ? path.join(rel, entry.name) : entry.name;
        const destPath = path.join(DEST_ROOT, relPath);

        if (entry.isDirectory()) {
            if (entry.name === ".obsidian") continue; // skip vault metadata

            fs.mkdirSync(destPath, { recursive: true });
            walkAndCopy(srcPath, relPath);
            continue;
        }

        // Always copy non-directory files (images, etc.)
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);

        // Process markdown files for slug/missing-link logic
        if (!entry.name.toLowerCase().endsWith(".md")) continue;

        const role = classifyFile(relPath);
        const content = fs.readFileSync(srcPath, "utf8");
        const slug = slugify(entry.name);
        const relPathNormalized = relPath.replace(/\\/g, "/");
        const links = extractWikiLinks(content);

        // PLAYER SLUG MAP – only files under Player folder
        if (role === "player") {
            slugMapPlayer[slug] = relPathNormalized;
        }

        // DM SLUG MAP – all md files visible (player + dm + global)
        if (role === "player" || role === "dm" || role === "global") {
            slugMapDM[slug] = relPathNormalized;
        }

        // LINKS – who references what?
        if (role === "player") {
            links.forEach((l) => linksFromPlayer.add(l));
        }
        if (role === "player" || role === "dm" || role === "global") {
            links.forEach((l) => linksFromDM.add(l));
        }
    }
}

// --- Run ---

console.log(`📁 Copying vault from ${VAULT_PATH} to ${DEST_ROOT}...`);
fs.mkdirSync(DEST_ROOT, { recursive: true });
walkAndCopy(VAULT_PATH);

// --- Build missing link lists ---

const playerExisting = new Set(Object.keys(slugMapPlayer));
const dmExisting = new Set(Object.keys(slugMapDM));

const missingPlayer = [...linksFromPlayer]
    .filter((slug) => !playerExisting.has(slug))
    .sort();

const missingDM = [...linksFromDM]
    .filter((slug) => !dmExisting.has(slug))
    .sort();

// --- Write manifests ---

const playerManifest = {
    mode: "player",
    playerFolder: PLAYER_FOLDER,
    slugMap: slugMapPlayer,
    missing: missingPlayer,
};

const dmManifest = {
    mode: "dm",
    playerFolder: PLAYER_FOLDER,
    dmFolder: DM_FOLDER,
    slugMap: slugMapDM,
    missing: missingDM,
};

fs.writeFileSync(
    path.join(DEST_ROOT, "player-manifest.json"),
    JSON.stringify(playerManifest, null, 2)
);

fs.writeFileSync(
    path.join(DEST_ROOT, "dm-manifest.json"),
    JSON.stringify(dmManifest, null, 2)
);

console.log("✅ Content build complete.");
console.log(`   Player slugs:  ${Object.keys(slugMapPlayer).length}`);
console.log(`   DM slugs:      ${Object.keys(slugMapDM).length}`);
console.log(`   Player missing: ${missingPlayer.length}`);
console.log(`   DM missing:     ${missingDM.length}`);
