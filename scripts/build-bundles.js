import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLAYER_BUNDLE_DIR = path.join(__dirname, "../PlayerBundle");
const DM_BUNDLE_DIR = path.join(__dirname, "../DMBundle");
const PLAYER_ZIP = path.join(__dirname, "../PlayerBundle.zip");
const DM_ZIP = path.join(__dirname, "../DMBundle.zip");
const EXE_NAME = "LoreViewer.exe";

// For content trimming
const DM_FOLDER = process.env.VITE_DM_FOLDER || "DM Section";

// --- Helpers ---

function cleanPath(p) {
    if (fs.existsSync(p)) fs.rmSync(p, { recursive: true });
}

function run(cmd) {
    console.log(`[CMD] ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
}

// --- 1. Clean old builds ---

console.log("[INFO] Cleaning old bundles...");
cleanPath(PLAYER_BUNDLE_DIR);
cleanPath(DM_BUNDLE_DIR);
cleanPath(PLAYER_ZIP);
cleanPath(DM_ZIP);

// --- 2. Build Vite ---

console.log("[INFO] Building Vite project...");
run("npm run build");

// --- 3. Compile EXE with Bun ---

console.log("[INFO] Compiling executable with bun...");
run(`bun build server.js --compile --outfile ${EXE_NAME}`);

// --- 4. Prepare common paths ---

const DIST_SRC = path.join(__dirname, "../dist");
const CONTENT_SRC = path.join(__dirname, "../public/content");
const EXE_SRC = path.join(__dirname, "..", EXE_NAME);

// Sanity checks
if (!fs.existsSync(DIST_SRC)) {
    console.error("❌ dist/ folder not found. Did the Vite build succeed?");
    process.exit(1);
}
if (!fs.existsSync(CONTENT_SRC)) {
    console.error("❌ public/content folder not found. Did you run build-content?");
    process.exit(1);
}
if (!fs.existsSync(EXE_SRC)) {
    console.error("❌ Executable not found. Did bun build succeed?");
    process.exit(1);
}

// --- 5. Build PlayerBundle ---

console.log("[INFO] Creating PlayerBundle...");

fs.mkdirSync(PLAYER_BUNDLE_DIR);

// Copy EXE
fs.copyFileSync(EXE_SRC, path.join(PLAYER_BUNDLE_DIR, EXE_NAME));

// Copy dist/
fs.cpSync(DIST_SRC, path.join(PLAYER_BUNDLE_DIR, "dist"), {
    recursive: true,
});

// Copy content/ then remove DM folder
fs.cpSync(CONTENT_SRC, path.join(PLAYER_BUNDLE_DIR, "content"), {
    recursive: true,
});

const playerContentRoot = path.join(PLAYER_BUNDLE_DIR, "content");
const dmFolderInPlayer = path.join(playerContentRoot, DM_FOLDER);

if (fs.existsSync(dmFolderInPlayer)) {
    console.log(`[INFO] Removing DM folder from PlayerBundle: ${dmFolderInPlayer}`);
    fs.rmSync(dmFolderInPlayer, { recursive: true });
}

// --- 6. Build DMBundle ---

console.log("[INFO] Creating DMBundle...");

fs.mkdirSync(DM_BUNDLE_DIR);

// Copy EXE
fs.copyFileSync(EXE_SRC, path.join(DM_BUNDLE_DIR, EXE_NAME));

// Copy dist/
fs.cpSync(DIST_SRC, path.join(DM_BUNDLE_DIR, "dist"), {
    recursive: true,
});

// Copy all content (Player + DM)
fs.cpSync(CONTENT_SRC, path.join(DM_BUNDLE_DIR, "content"), {
    recursive: true,
});

// --- 7. Zip both bundles ---

console.log("[INFO] Zipping PlayerBundle...");
let zip = new AdmZip();
zip.addLocalFolder(PLAYER_BUNDLE_DIR, "PlayerBundle");
zip.writeZip(PLAYER_ZIP);

console.log("[INFO] Zipping DMBundle...");
zip = new AdmZip();
zip.addLocalFolder(DM_BUNDLE_DIR, "DMBundle");
zip.writeZip(DM_ZIP);

console.log("\n[INFO] DONE!");
console.log(`Created PlayerBundle.zip and DMBundle.zip in project root.`);
