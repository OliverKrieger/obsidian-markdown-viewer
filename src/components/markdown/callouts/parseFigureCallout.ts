// src/components/markdown/callouts/parseFigureCallout.ts
type HastNode = any;

function getTextFromNode(node: HastNode): string {
  if (!node) return "";
  if (node.type === "text" && typeof node.value === "string") return node.value;
  if (Array.isArray(node.children)) return node.children.map(getTextFromNode).join("");
  return "";
}

function findFirstImg(node: HastNode): { src?: string; alt?: string } | null {
  if (!node) return null;
  if (node.type === "element" && node.tagName === "img") {
    return { src: node.properties?.src, alt: node.properties?.alt };
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findFirstImg(child);
      if (found?.src) return found;
    }
  }
  return null;
}

function normaliseKey(k: string) {
  return k.trim().toLowerCase();
}

export type ParsedFigureParams = {
  src?: string;
  alt?: string;
  caption?: string;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
  variant?: "plain" | "framed" | "card";
  href?: string;
};

export function parseFigureCallout(
  blockquoteNode: HastNode,
  calloutHeaderText: string
): ParsedFigureParams {
  const img = findFirstImg(blockquoteNode);

  // Key insight: in your AST, everything is in ONE <p>,
  // and the params are in a single text node with newlines.
  const rawText = getTextFromNode(blockquoteNode);

  // Split into lines and clean
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    // remove the header line (exact match)
    .filter((l) => l !== calloutHeaderText.trim());

  const params: ParsedFigureParams = {};

  for (const line of lines) {
    // Allow values to contain colons; just split on first colon
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = normaliseKey(line.slice(0, idx));
    const value = line.slice(idx + 1).trim();
    if (!value) continue;

    switch (key) {
      case "caption":
      case "desc":
      case "description":
        params.caption = value;
        break;

      case "src":
      case "img":
      case "image":
        params.src = value;
        break;

      case "alt":
        params.alt = value;
        break;

      case "align":
        if (value === "left" || value === "center" || value === "right") {
          params.align = value;
        }
        break;

      case "width":
        params.width = value;
        break;

      case "class":
      case "classname":
        params.className = value;
        break;

      case "variant":
        if (value === "plain" || value === "framed" || value === "card") {
          params.variant = value;
        }
        break;

      case "href":
      case "link":
        params.href = value;
        break;

      default:
        break;
    }
  }

  // Prefer explicit src/alt, otherwise use the embedded image
  if (!params.src && img?.src) params.src = img.src;
  if (!params.alt && img?.alt) params.alt = img.alt;

  return params;
}
