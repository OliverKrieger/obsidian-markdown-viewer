import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// PATHS
// ==========================
const BUNDLES_ROOT = path.join(__dirname, "../bundles");

const PLAYER_BUNDLE_DIR = path.join(BUNDLES_ROOT, "PlayerBundle");
const DM_BUNDLE_DIR = path.join(BUNDLES_ROOT, "DMBundle");

const PLAYER_ZIP = path.join(BUNDLES_ROOT, "PlayerBundle.zip");
const DM_ZIP = path.join(BUNDLES_ROOT, "DMBundle.zip");

const EXE_NAME = "LoreViewer.exe";

const DIST_SRC = path.join(__dirname, "../dist");
const CONTENT_SRC = path.join(__dirname, "../public/content");
const EXE_SRC = path.join(__dirname, "..", EXE_NAME);

// ==========================
// HELPERS
// ==========================
function clean(p) {
    if (fs.existsSync(p)) fs.rmSync(p, { recursive: true });
}

function ensureDir(p) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function run(cmd) {
    console.log(`[CMD] ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
}

function safeCopy(src, dest) {
    if (!fs.existsSync(src)) {
        console.error(`❌ Missing: ${src}`);
        process.exit(1);
    }
    fs.cpSync(src, dest, { recursive: true });
}

// ==========================
// CLEAN PREVIOUS OUTPUTS
// ==========================
console.log("[INFO] Cleaning bundles directory...");
ensureDir(BUNDLES_ROOT);
clean(PLAYER_BUNDLE_DIR);
clean(DM_BUNDLE_DIR);
clean(PLAYER_ZIP);
clean(DM_ZIP);

// ==========================
// BUILD VITE
// ==========================
console.log("[INFO] Running Vite build...");
run("npm run build");

// ==========================
// BUILD EXE
// ==========================
console.log("[INFO] Compiling Bun executable...");
run(`bun build server.js --compile --outfile ${EXE_NAME}`);

if (!fs.existsSync(DIST_SRC)) throw new Error("❌ dist/ missing.");
if (!fs.existsSync(CONTENT_SRC)) throw new Error("❌ public/content missing.");
if (!fs.existsSync(EXE_SRC)) throw new Error("❌ Executable missing.");

// ==========================
// UTILITY – recursive prune based on manifest
// ==========================
function pruneContentToManifest(contentRoot, manifestPath) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const allowedPaths = new Set(Object.values(manifest.slugMap));

    function recurse(dir) {
        for (const entry of fs.readdirSync(dir)) {
            const fullPath = path.join(dir, entry);
            const rel = path.relative(contentRoot, fullPath).replace(/\\/g, "/");

            if (fs.statSync(fullPath).isDirectory()) {
                recurse(fullPath);
                if (fs.readdirSync(fullPath).length === 0) {
                    fs.rmdirSync(fullPath);
                }
            } else {
                if (!allowedPaths.has(rel)) {
                    fs.rmSync(fullPath);
                }
            }
        }
    }

    recurse(contentRoot);
}

// ==========================
// PLAYER BUNDLE
// ==========================
console.log("\n[INFO] Building PlayerBundle...");
ensureDir(PLAYER_BUNDLE_DIR);

// Copy executable
fs.copyFileSync(EXE_SRC, path.join(PLAYER_BUNDLE_DIR, EXE_NAME));

// Copy dist/
safeCopy(DIST_SRC, path.join(PLAYER_BUNDLE_DIR, "dist"));

// Write viewer-mode.json to dist/
fs.writeFileSync(
    path.join(PLAYER_BUNDLE_DIR, "dist", "viewer-mode.json"),
    JSON.stringify({ mode: "player" }, null, 2)
);

// Copy full content temporarily
safeCopy(CONTENT_SRC, path.join(PLAYER_BUNDLE_DIR, "content"));

// Prune DM content physically
console.log("[INFO] Removing DM content from PlayerBundle...");
const playerContentRoot = path.join(PLAYER_BUNDLE_DIR, "content");
const playerManifest = path.join(playerContentRoot, "player-manifest.json");

if (!fs.existsSync(playerManifest)) {
    console.error("❌ player-manifest.json missing in content folder!");
    process.exit(1);
}

pruneContentToManifest(playerContentRoot, playerManifest);

console.log("[INFO] PlayerBundle content pruning complete.");

// ==========================
// DM BUNDLE
// ==========================
console.log("\n[INFO] Building DMBundle...");
ensureDir(DM_BUNDLE_DIR);

// Copy executable
fs.copyFileSync(EXE_SRC, path.join(DM_BUNDLE_DIR, EXE_NAME));

// Copy dist/
safeCopy(DIST_SRC, path.join(DM_BUNDLE_DIR, "dist"));

// Write viewer-mode.json to dist/
fs.writeFileSync(
    path.join(DM_BUNDLE_DIR, "dist", "viewer-mode.json"),
    JSON.stringify({ mode: "dm" }, null, 2)
);

// Copy full content (DM keeps everything)
safeCopy(CONTENT_SRC, path.join(DM_BUNDLE_DIR, "content"));

// ==========================
// ZIP BOTH
// ==========================
console.log("\n[INFO] Zipping PlayerBundle...");
let zip = new AdmZip();
zip.addLocalFolder(PLAYER_BUNDLE_DIR, "PlayerBundle");
zip.writeZip(PLAYER_ZIP);

console.log("[INFO] Zipping DMBundle...");
zip = new AdmZip();
zip.addLocalFolder(DM_BUNDLE_DIR, "DMBundle");
zip.writeZip(DM_ZIP);

console.log("\n🎉 Bundling complete!");
console.log(`Bundles available in: ${BUNDLES_ROOT}`);
