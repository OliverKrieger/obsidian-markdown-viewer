import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import open from "open";

const isBundled = !!process.pkg || !!process.isBun;
const exeDir = path.dirname(process.execPath);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use EXE directory when bundled
const baseDir = isBundled ? exeDir : __dirname;

const app = express();
const distPath = path.join(baseDir, "dist");

// Serve static files
app.use(express.static(distPath));

// SPA fallback
app.get(/.*/, (_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = 5678;

app.listen(PORT, () => {
  console.log(`World Viewer running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
