import { PlainExtension } from "remirror";

/**
 * Simple extension that removes links from pasted content
 * by intercepting paste events and cleaning the clipboard data
 */
export class SimplePasteFilter extends PlainExtension {
    // Define regex patterns once for better performance
    private static readonly URL_PATTERNS = [
        // Remove standalone URLs
        /(?:https?:\/\/|www\.)[^\s]+/gi,
        // Remove email addresses that might be linked
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    ];

    private static readonly HTML_TAG_PATTERN = /<[^>]*>/g;
    private static readonly WHITESPACE_PATTERN = /\s+/g;

    get name() {
        return "simplePasteFilter" as const;
    }

    createPlugin() {
        return {
            props: {
                handlePaste: (view, event, slice) => {
                    const clipboardData = event.clipboardData;
                    if (!clipboardData) return false;

                    const htmlContent = clipboardData.getData("text/html");
                    const plainText = clipboardData.getData("text/plain");

                    if (htmlContent || plainText) {
                        event.preventDefault();

                        const cleanText = this.cleanContent(
                            htmlContent || plainText
                        );

                        if (cleanText.trim()) {
                            const { state } = view;
                            const { tr } = state;
                            tr.insertText(cleanText, state.selection.from);
                            view.dispatch(tr);
                        }

                        return true;
                    }

                    return false;
                },
            },
        };
    }

    /**
     * Clean content by removing HTML tags and URL patterns
     */
    private cleanContent(content: string): string {
        let cleanContent = content;

        if (content.includes("<")) {
            cleanContent = this.stripHtmlTags(content);
        }

        cleanContent = this.removeUrlPatterns(cleanContent);

        return cleanContent;
    }

    /**
     * Simple HTML tag removal
     */
    private stripHtmlTags(html: string): string {
        if (typeof document !== "undefined") {
            const temp = document.createElement("div");
            temp.innerHTML = html;
            return temp.textContent || temp.innerText || "";
        }

        return html
            .replace(SimplePasteFilter.HTML_TAG_PATTERN, " ")
            .replace(SimplePasteFilter.WHITESPACE_PATTERN, " ")
            .trim();
    }

    /**
     * Remove URL patterns from text
     */
    private removeUrlPatterns(text: string): string {
        let cleanText = text;
        SimplePasteFilter.URL_PATTERNS.forEach((pattern) => {
            cleanText = cleanText.replace(pattern, "");
        });

        // Clean up extra whitespace
        return cleanText
            .replace(SimplePasteFilter.WHITESPACE_PATTERN, " ")
            .trim();
    }
}
