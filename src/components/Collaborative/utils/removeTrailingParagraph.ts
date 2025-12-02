import { RemirrorJSON } from "remirror";

/**
 * Removes the last paragraph from a Remirror document if it is of type "paragraph"
 * @param doc - Remirror document in JSON format
 * @returns Document without the last paragraph, if it exists
 */
export function removeTrailingParagraph(
    doc: RemirrorJSON | null | undefined
): RemirrorJSON | null | undefined {
    if (!doc || !Array.isArray(doc.content)) return doc;

    const items = [...doc.content];
    const last = items[items.length - 1];

    if (last?.type === "paragraph") {
        items.pop();
    }

    return { ...doc, content: items };
}
