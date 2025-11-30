# World Viewer

A Vite + React application for visualizing Obsidian markdown content — with the ability to split between player and DM facing bundles.  
This project pulls `.md` files from your Obsidian vault, processes them, and exposes them inside a bundled viewer application.

---

## Contents

- [Overview](#overview)
- [Obsidian Folder Structure](#obsidian-folder-structure)
- [Environment Variables](#environment-variables)
- [How Markdown Import Works](#how-markdown-import-works)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Building](#building)
- [Testing Build Locally](#testing-build-locally)
- [Bundling the Player Build (EXE + ZIP)](#bundling-the-player-build-exe--zip)
- [Requirements (Bun)](#requirements-bun)

---

## Overview

The **World Viewer** reads markdown content directly from an Obsidian vault.  
During development and build, it automatically pulls markdown files from a configured folder, copies them into:

```
public/content/
```


…and generates 2 manifest files - `dm-manifest.json` and `player-manifest`. These manifests will be in format:
```
{
  "mode": "player" | "dm",
  "slugMap": {},
  "images": String [],
  "missing": String []
}
```
- Mode is used to know later if the application is in DM mode or Player mode. For development purposes, you can switch between them, but in the final build, the bundler sets it to the correct format.
- Slug map for fast lookup/visualization inside the app.
- Images are for any images, as they require custom handling to render properly for obsidian pathing.
- Missing is links that you have in obsidian, but have no notes created for them.

This allows you to maintain your lore/stories/world notes in Obsidian while generating a separate, cleaned player-facing and dm-facing viewer.

---

## Obsidian Folder Structure

Your Obsidian vault is expected to be structured at least like:

```
ObsidianVault/
│
├── DM Notes/
└── Players/
```


Only the folder referenced in your `.env` file is imported.
It is **your responsibility** to keep DM Notes and Player Notes separated in Obsidian.

---

## Environment Variables

Create a `.env.development` file containing:


```
VITE_VAULT_PATH="<absolute_path_to_obsidian_folder>"
VITE_PLAYER_FOLDER="<name_of_player_folder>"
VITE_DM_FOLDER="<name_of_dm_folder>"
VITE_MODE=development | production
VITE_VIEWER_MODE=player | dm
```

Example:
```
VITE_VAULT_PATH="C:\\Users\\You\\Documents\\Obsidian\\MyWorld"
VITE_PLAYER_FOLDER="Player Section"
VITE_DM_FOLDER="DM Section"
VITE_MODE="development"
VITE_VIEWER_MODE="dm"
```


This folder will be recursively scanned for `.md` files and copied into the app.

---

## How Markdown Import Works

Before `vite dev` or `vite build`, the script  
`scripts/predev-copy-content.js` runs automatically.

### What this script does

1. Reads `VITE_VAULT_PATH`
2. Recursively walks the folder, copying **all `.md` and image files**
3. Copies them into:`public/content/`
4. Generates `dm-manifest.json` and `player-manifest.json` mapping

### Slugifying Rules

The script transforms filenames by:

- removing .md
- converting _ to spaces (01_Regions.md → 01 Regions)
- trimming whitespace

These slugs allow the React app to link, load, and display markdown files consistently.

## Available Scripts

| Script              | Description                                                         |
|---------------------|---------------------------------------------------------------------|
| `npm run dev`       | Starts the Vite dev server *(after importing markdown)*             |
| `npm run build`     | Builds the Vite project for production *(after importing markdown)* |
| `npm run serve:dist`| Runs a lightweight Express server to serve the built `dist/` folder |
| `npm run bundle` | Creates a distributable EXE + zipped Bundle               |
| `npm run lint`      | Runs ESLint                                                         |
| `predev / prebuild` | Automatically run the markdown import script                        |

## Development

### Start the dev server

```
npm run dev
```

This will:

- Import markdown from Obsidian
- Start Vite normally

You can now browse the viewer at:
```
http://localhost:5173
```

## Building

### Standard Vite Build

```
npm run build
```

This:

- imports markdown
- produces a production output under dist/

### Testing Build Locally

Once built, run:
```
npm run serve:dist
```

This uses a simple Express server to load your production build:

```
app.use(express.static(distPath));
app.get(/.*/, (_, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});
```

You can now verify that the build behaves correctly before bundling.

---

## Bundling the Player Build (EXE + ZIP)

To create a self-contained distributable (PlayerBundle.zip or DMBundle.zip):
```
npm run bundle
```

This performs:

### 1. Build Vite
```
npm run build
```

### 2. Compile an executable (with Bun)
```
bun build server.js --compile --outfile LoreViewer.exe
```

This produces a standalone Windows executable that serves the embedded dist/ folder.

### 3. Create the Bundle directories
Contains:
- `LoreViewer.exe`
- `dist/`

### 4. Zip it

Outputs:
```
PlayerBundle.zip
DMBundle.zip
```

This ZIP can be given to players or used as a DM to view all notes.
They simply extract and run LoreViewer.exe.

---

## Requirements (Bun)

Bundling requires Bun, because the EXE compilation step uses:
```
bun build --compile
```

### Install Bun (Linux / macOS)
```
curl -fsSL https://bun.sh/install | bash
```

### Install Bun (Windows PowerShell)
```
iwr https://bun.sh/install.ps1 -useb | iex
```

---

## Summary

- Obsidian markdown → Imported automatically
- Dev server → `npm run dev`
- Build → `npm run build`
- Test production → `npm run serve:dist`
- Create EXE + ZIP → `npm run bundle`
- Requires Bun for the final executable