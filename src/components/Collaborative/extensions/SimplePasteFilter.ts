import { PlainExtension } from "remirror";
import { Fragment } from "prosemirror-model";

/**
 * Simple extension that removes hyperlinks from pasted content
 * by intercepting paste events and extracting only plain text
 */
export class SimplePasteFilter extends PlainExtension {
    private static readonly MAX_PASTE_LENGTH = 1048576;
    private static readonly WHITESPACE_REGEX = /\s+/g;

    get name() {
        return "simplePasteFilter" as const;
    }

    createPlugin() {
        return {
            props: {
                handlePaste: (view, event, slice) => {
                    const clipboardData = event.clipboardData;
                    if (!clipboardData) return false;

                    let plainText = clipboardData.getData("text/plain");

                    if (!plainText?.trim()) return false;
                    if (plainText.length > SimplePasteFilter.MAX_PASTE_LENGTH) {
                        console.warn(
                            "Paste content too large, truncating to 1MB"
                        );
                        plainText = plainText.substring(
                            0,
                            SimplePasteFilter.MAX_PASTE_LENGTH
                        );
                    }

                    if (plainText.trim()) {
                        event.preventDefault();

                        const { state } = view;
                        const { tr } = state;

                        if (
                            plainText.includes("\n\n") ||
                            plainText.match(/\n\s*\n/)
                        ) {
                            this.insertParagraphNodes(
                                tr,
                                plainText,
                                state.selection.from,
                                state.schema
                            );
                        } else {
                            const cleanText = plainText
                                .replace(
                                    SimplePasteFilter.WHITESPACE_REGEX,
                                    " "
                                )
                                .trim();
                            tr.insertText(cleanText, state.selection.from);
                        }

                        view.dispatch(tr);

                        return true;
                    }

                    return false;
                },
            },
        };
    }

    private insertParagraphNodes(
        tr: any,
        text: string,
        position: number,
        schema: any
    ) {
        const lines = text.split("\n");
        const nodes = [];
        const paragraphParts = [];

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine === "") {
                if (paragraphParts.length > 0) {
                    const cleanParagraph = paragraphParts
                        .join(" ")
                        .replace(SimplePasteFilter.WHITESPACE_REGEX, " ")
                        .trim();
                    nodes.push(
                        schema.nodes.paragraph.create(
                            null,
                            schema.text(cleanParagraph)
                        )
                    );
                    paragraphParts.length = 0;
                }

                nodes.push(schema.nodes.paragraph.create());
            } else {
                paragraphParts.push(trimmedLine);
            }
        }

        if (paragraphParts.length > 0) {
            const cleanParagraph = paragraphParts
                .join(" ")
                .replace(SimplePasteFilter.WHITESPACE_REGEX, " ")
                .trim();
            nodes.push(
                schema.nodes.paragraph.create(null, schema.text(cleanParagraph))
            );
        }

        if (nodes.length === 0) return;

        const fragment = Fragment.from(nodes);
        tr.replaceWith(position, position, fragment);
    }
}
