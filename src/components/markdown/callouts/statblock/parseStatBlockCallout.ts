import type { NormalizedStatBlock } from "./types";
import { parseSwade } from "./parseSwade";
import { parseDnd5e } from "./parseDnD5e";

type HastNode = any;

function getTextFromNode(node: HastNode): string {
	if (!node) return "";
	if (node.type === "text" && typeof node.value === "string") return node.value;
	if (Array.isArray(node.children)) return node.children.map(getTextFromNode).join("");
	return "";
}

function extractLines(blockquoteNode: HastNode, headerLine: string) {
	const raw = getTextFromNode(blockquoteNode)
		.replace(/\r\n/g, "\n")
		.replace(/\r/g, "\n");

	console.log("[statblock] RAW >>>\n" + raw + "\n<<< END RAW");

	const header = headerLine.trim();

	const lines = raw
		.split("\n")
		.map((l) => l.trimEnd())
		.filter((l) => l.trim() !== header); // keep blanks, remove header line

	return lines;
}

function readRuleset(lines: string[]) {
	const ruleLine = lines.find((l) => l && /^ruleset\s*:/i.test(l));
	if (!ruleLine) return "swade"; // default if omitted
	const idx = ruleLine.indexOf(":");
	return ruleLine.slice(idx + 1).trim().toLowerCase();
}

export function parseStatBlockCallout(
	blockquoteNode: HastNode,
	calloutHeaderText: string,
	title: string
): NormalizedStatBlock {
	const lines = extractLines(blockquoteNode, calloutHeaderText);
	const ruleset = readRuleset(lines);

	if (ruleset === "swade") return parseSwade(lines, title);
	if (ruleset === "dnd5e") return parseDnd5e(lines, title);

	return {
		ruleset,
		title,
		raw: lines.join("\n"),
	};
}
