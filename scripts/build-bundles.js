import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// PATHS
// =============================
const BUNDLES_ROOT = path.join(__dirname, "../bundles");

const PLAYER_BUNDLE_DIR = path.join(BUNDLES_ROOT, "PlayerBundle");
const DM_BUNDLE_DIR = path.join(BUNDLES_ROOT, "DMBundle");

const PLAYER_ZIP = path.join(BUNDLES_ROOT, "PlayerBundle.zip");
const DM_ZIP = path.join(BUNDLES_ROOT, "DMBundle.zip");

const EXE_NAME = "LoreViewer.exe";

const DIST_SRC = path.join(__dirname, "../dist");
const CONTENT_SRC = path.join(__dirname, "../public/content");
const EXE_SRC = path.join(__dirname, "..", EXE_NAME);

// =============================
// UTILITIES
// =============================
function run(cmd) {
    console.log(`[CMD] ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
}

function clean(p) {
    if (fs.existsSync(p)) fs.rmSync(p, { recursive: true });
}

function ensure(p) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copy(src, dest) {
    if (!fs.existsSync(src)) {
        console.error(`❌ Missing: ${src}`);
        process.exit(1);
    }
    fs.cpSync(src, dest, { recursive: true });
}

// =============================
// PRUNING LOGIC
// =============================
function pruneToManifest(contentRoot, manifestPath) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const allowedMd = new Set(Object.values(manifest.slugMap));
    const allowedImages = new Set(manifest.images);

    function walk(folder) {
        for (const entry of fs.readdirSync(folder)) {
            const full = path.join(folder, entry);
            const rel = path.relative(contentRoot, full).replace(/\\/g, "/");

            if (fs.statSync(full).isDirectory()) {
                walk(full);
                if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
                continue;
            }

            if (rel.endsWith(".md")) {
                if (!allowedMd.has(rel)) fs.rmSync(full);
                continue;
            }

            if (!allowedImages.has(rel)) fs.rmSync(full);
        }
    }

    walk(contentRoot);
}

// =============================
// CLEAN OLD OUTPUT
// =============================
console.log("[INFO] Cleaning old bundles…");
ensure(BUNDLES_ROOT);

clean(PLAYER_BUNDLE_DIR);
clean(DM_BUNDLE_DIR);
clean(PLAYER_ZIP);
clean(DM_ZIP);

// =============================
// BUILD VITE + EXE
// =============================
console.log("[INFO] Building Vite…");
run("npm run build");

console.log("[INFO] Building executable with Bun…");
run(`bun build server.js --compile --outfile ${EXE_NAME}`);

if (!fs.existsSync(DIST_SRC)) throw new Error("dist missing");
if (!fs.existsSync(CONTENT_SRC)) throw new Error("public/content missing");
if (!fs.existsSync(EXE_SRC)) throw new Error("EXE missing");

// =============================
// PLAYER BUNDLE
// =============================
console.log("\n[INFO] Creating PlayerBundle…");
ensure(PLAYER_BUNDLE_DIR);

fs.copyFileSync(EXE_SRC, path.join(PLAYER_BUNDLE_DIR, EXE_NAME));

copy(DIST_SRC, path.join(PLAYER_BUNDLE_DIR, "dist"));
copy(CONTENT_SRC, path.join(PLAYER_BUNDLE_DIR, "content"));

fs.writeFileSync(
    path.join(PLAYER_BUNDLE_DIR, "dist", "viewer-mode.json"),
    JSON.stringify({ mode: "player" }, null, 2)
);

console.log("[INFO] Pruning PlayerBundle content…");
pruneToManifest(
    path.join(PLAYER_BUNDLE_DIR, "content"),
    path.join(PLAYER_BUNDLE_DIR, "content/player-manifest.json")
);

// =============================
// DM BUNDLE
// =============================
console.log("\n[INFO] Creating DMBundle…");
ensure(DM_BUNDLE_DIR);

fs.copyFileSync(EXE_SRC, path.join(DM_BUNDLE_DIR, EXE_NAME));

copy(DIST_SRC, path.join(DM_BUNDLE_DIR, "dist"));
copy(CONTENT_SRC, path.join(DM_BUNDLE_DIR, "content"));

fs.writeFileSync(
    path.join(DM_BUNDLE_DIR, "dist", "viewer-mode.json"),
    JSON.stringify({ mode: "dm" }, null, 2)
);

// =============================
// ZIP BOTH
// =============================
console.log("\n[INFO] Zipping PlayerBundle…");
let zip = new AdmZip();
zip.addLocalFolder(PLAYER_BUNDLE_DIR, "PlayerBundle");
zip.writeZip(PLAYER_ZIP);

console.log("[INFO] Zipping DMBundle…");
zip = new AdmZip();
zip.addLocalFolder(DM_BUNDLE_DIR, "DMBundle");
zip.writeZip(DM_ZIP);

console.log("\n🎉 Bundling complete!");
console.log(`Bundles are available at: ${BUNDLES_ROOT}`);
