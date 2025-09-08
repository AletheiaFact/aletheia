import { PlainExtension } from "remirror";

/**
 * Simple extension that removes hyperlinks from pasted content
 * by intercepting paste events and extracting only plain text
 */
export class SimplePasteFilter extends PlainExtension {
    get name() {
        return "simplePasteFilter" as const;
    }

    createPlugin() {
        return {
            props: {
                handlePaste: (view, event, slice) => {
                    const clipboardData = event.clipboardData;
                    if (!clipboardData) return false;

                    const plainText = clipboardData.getData("text/plain");

                    if (plainText && plainText.trim()) {
                        event.preventDefault();

                        const { state } = view;
                        const { tr } = state;
                        tr.insertText(plainText, state.selection.from);
                        view.dispatch(tr);

                        return true;
                    }

                    return false;
                },
            },
        };
    }
}
