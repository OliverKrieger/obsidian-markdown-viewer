import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//
// CONFIG
//
const OUT_DIR = path.join(__dirname, "../PlayerBundle");
const ZIP_FILE = path.join(__dirname, "../PlayerBundle.zip");
const EXE_NAME = "LoreViewer.exe";

//
// CLEAN OLD BUILDS
//
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true });
if (fs.existsSync(ZIP_FILE)) fs.rmSync(ZIP_FILE);

//
// STEP 1: Build Vite
//
console.log("[INFO] Building Vite project...");
execSync("npm run build", { stdio: "inherit" });

//
// STEP 2: Compile EXE with Bun
//
console.log("[INFO] Compiling executable with bun...");
execSync(`bun build server.js --compile --outfile ${EXE_NAME}`, {
    stdio: "inherit",
});

//
// STEP 3: Create PlayerBundle/
//
console.log("[INFO] Creating PlayerBundle directory...");
fs.mkdirSync(OUT_DIR);

//
// Copy EXE
//
fs.copyFileSync(EXE_NAME, path.join(OUT_DIR, EXE_NAME));

//
// Copy dist/
//
console.log("[INFO] Copying dist folder...");
fs.cpSync(path.join(__dirname, "../dist"), path.join(OUT_DIR, "dist"), {
    recursive: true,
});

//
// STEP 4: Zip it
//
console.log("[INFO] Zipping PlayerBundle...");
const zip = new AdmZip();
zip.addLocalFolder(OUT_DIR, "PlayerBundle");
zip.writeZip(ZIP_FILE);

console.log("\n[INFO] DONE!");
console.log(`Created PlayerBundle.zip in project root.`);
