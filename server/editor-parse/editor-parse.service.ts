import { Injectable } from "@nestjs/common";
import { RemirrorJSON } from "remirror";

const EditorSchemaArray = ["summary", "report", "verification", "questions"];

@Injectable()
export class EditorParseService {
    reportHasSources(report): boolean {
        return report.sources.length > 0;
    }

    getSourceByProperty(sources, property) {
        return sources.filter((s) => {
            return s.field === property;
        });
    }

    async editor2schema() {}

    async schema2editor(databaseReport) {
        const doc: RemirrorJSON = {
            type: "doc",
            content: [],
        };

        for (const key in databaseReport) {
            if (EditorSchemaArray.includes(key)) {
                const content = databaseReport[key];
                if (!this.reportHasSources(databaseReport)) {
                    doc.content.push(
                        ...this.buildContentWithoutSouces(key, content)
                    );
                    continue;
                }
                const sources = this.getSourceByProperty(
                    databaseReport.sources,
                    key
                );

                const rawSourcesRanges = sources.map((s) => {
                    return s.textRange;
                });
                const sourcesRanges = sources.map((source) => {
                    return {
                        ...source,
                        type: "source",
                    };
                });
                doc.content.push(
                    ...this.buildContentFragments({
                        content,
                        key,
                        sourcesRanges,
                        rawSourcesRanges,
                    })
                );
            }
        }
        return doc;
    }

    extractContentFragmentFromRange(
        { textRange, content, href = null },
        type = "text"
    ) {
        const fragmentText = content.slice(...textRange);
        if (type === "text") {
            return this.getContentObject(fragmentText);
        }

        if (type === "source") {
            return this.getContentObjectWithMarks(fragmentText, href);
        }
    }

    getMissingRanges(ranges, length) {
        const missingRanges = [];

        if (ranges.length === 0) {
            // If there are no provided ranges, the missing range is the entire length.
            missingRanges.push([0, length]);
        } else {
            // Check the gap before the first range.
            if (ranges[0][0] > 0) {
                missingRanges.push([0, ranges[0][0]]);
            }

            // Check the gap between the ranges.
            for (let i = 1; i < ranges.length; i++) {
                const gapStart = ranges[i - 1][1];
                const gapEnd = ranges[i][0];
                if (gapStart < gapEnd) {
                    missingRanges.push([gapStart, gapEnd]);
                }
            }

            // Check the gap after the last range.
            if (ranges[ranges.length - 1][1] < length) {
                missingRanges.push([ranges[ranges.length - 1][1], length]);
            }
        }

        return missingRanges;
    }

    getContentObject(text) {
        return {
            type: "paragraph",
            content: [
                {
                    type: "text",
                    /**
                     * https://remirror.io/docs/errors/#rmr0021
                     * The text can not be a empty string,
                     * because it is not supported by remirror.
                     * */
                    text: text === "" ? " " : text,
                },
            ],
        };
    }

    getContentObjectWithMarks(content, href) {
        return {
            ...this.getContentObject(content),
            marks: [
                {
                    type: "link",
                    attrs: {
                        href: href,
                        target: null,
                        auto: false,
                    },
                },
            ],
        };
    }

    getTextFragments(rawSourcesRanges, sourcesRanges, key, content) {
        const missingTextRanges = this.getMissingRanges(
            rawSourcesRanges,
            content.length
        ).map((textRange) => {
            return {
                textRange,
                type: "text",
            };
        });

        const allRanges = [...sourcesRanges, ...missingTextRanges].sort(
            (a, b) => {
                return a.textRange[0] - b.textRange[0];
            }
        );

        const textFragments = allRanges.map(({ textRange, type, href }) => {
            return this.extractContentFragmentFromRange(
                {
                    textRange,
                    content,
                    href,
                },
                type
            );
        });

        return textFragments;
    }

    buildContentWithoutSouces(key, content): RemirrorJSON[] {
        if (Array.isArray(content)) {
            const questions = content.map((c) => {
                return {
                    type: key,
                    content: [this.getContentObject(c)],
                };
            });

            return questions;
        } else {
            return [
                {
                    type: key,
                    content: [this.getContentObject(content)],
                },
            ];
        }
    }

    buildContentFragments({
        content,
        key,
        rawSourcesRanges,
        sourcesRanges,
    }): RemirrorJSON[] {
        if (Array.isArray(content)) {
            return content.map((c) => {
                return {
                    type: key,
                    content: this.getTextFragments(
                        rawSourcesRanges,
                        sourcesRanges,
                        key,
                        c
                    ),
                };
            });
        } else {
            return [
                {
                    type: key,
                    content: this.getTextFragments(
                        rawSourcesRanges,
                        sourcesRanges,
                        key,
                        content
                    ),
                },
            ];
        }
    }
}
