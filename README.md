# World Viewer

A Vite + React application for visualizing Obsidian markdown content — especially structured player-facing lore.  
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
public/content/Player/
```


…and generates an `index.json` slug map for fast lookup/visualization inside the app.

This allows you to maintain your lore/stories/world notes in Obsidian while generating a separate, cleaned player-facing viewer.

---

## Obsidian Folder Structure

Your Obsidian vault is expected to be structured at least like:

```
ObsidianVault/
│
├── DM Notes/
└── Players/ <-- this folder is usually used for VITE_PLAYER_MARKDOWN_PATH
```


Only the folder referenced in your `.env` file is imported.  
It is **your responsibility** to keep DM Notes and Player Notes separated in Obsidian.

---

## Environment Variables

Create a `.env.development` file containing:


```
VITE_PLAYER_MARKDOWN_PATH="<absolute_path_to_obsidian_player_folder>"
```

Example:
```
VITE_PLAYER_MARKDOWN_PATH="C:/Users/You/Documents/Obsidian/MyWorld/Players"
```


This folder will be recursively scanned for `.md` files and copied into the app.

---

## How Markdown Import Works

Before `vite dev` or `vite build`, the script  
`scripts/copy-player-markdown.js` runs automatically.

### What this script does

1. Reads `VITE_PLAYER_MARKDOWN_PATH`
2. Recursively walks the folder, copying **all `.md` files**
3. Copies them into:`public/content/Player/`
4. Generates `index.json` mapping:

```json
{
  "City of Brass": "Cities/CityOfBrass.md",
  "Orders": "Factions/Orders.md"
}
```

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
| `npm run bundle:player` | Creates a distributable EXE + zipped PlayerBundle               |
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

To create a self-contained distributable (PlayerBundle.zip):
```
npm run bundle:player
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

### 3. Create the PlayerBundle directory
Contains:
- `LoreViewer.exe`
- `dist/`

### 4. Zip it

Outputs:
```
PlayerBundle.zip
```

This ZIP can be given to players.
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
- Create EXE + ZIP → `npm run bundle:player`
- Requires Bun for the final executable