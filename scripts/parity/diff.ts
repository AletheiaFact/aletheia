import * as fs from "fs";
import { diffNormalized, normalizeForParity } from "./normalize";

// Offline parity check: the same records read through both backends, dumped
// as JSON, compared shape-for-shape after normalization.
//   yarn parity:diff --left mongo.json --right postgres.json [--drop key,key]
function arg(name: string): string | undefined {
    const index = process.argv.indexOf(`--${name}`);
    return index === -1 ? undefined : process.argv[index + 1];
}

const leftPath = arg("left");
const rightPath = arg("right");
if (!leftPath || !rightPath) {
    console.error(
        "usage: parity:diff --left <file.json> --right <file.json> [--drop a,b]"
    );
    process.exit(2);
}

const options = { dropKeys: arg("drop")?.split(",").filter(Boolean) ?? [] };
const left = normalizeForParity(
    JSON.parse(fs.readFileSync(leftPath, "utf8")),
    options
);
const right = normalizeForParity(
    JSON.parse(fs.readFileSync(rightPath, "utf8")),
    options
);
const diffs = diffNormalized(left, right);

if (diffs.length === 0) {
    console.log("parity: no differences");
    process.exit(0);
}
for (const d of diffs) {
    console.log(
        `${d.path}\n  left:  ${JSON.stringify(
            d.left
        )}\n  right: ${JSON.stringify(d.right)}`
    );
}
console.log(`parity: ${diffs.length} difference(s)`);
process.exit(1);
