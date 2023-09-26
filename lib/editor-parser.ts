import { ObjectMark, RemirrorJSON } from "remirror";
import { ReviewTaskMachineContextReviewData } from "../server/claim-review-task/dto/create-claim-review-task.dto";

const EditorSchemaArray = ["summary", "report", "verification", "questions"];

export class EditorParser {
    reportHasSources(report): boolean {
        return report.sources.length > 0;
    }

    getSourceByProperty(sources, property) {
        return sources.filter((s) => {
            return s.field === property;
        });
    }

    editor2schema(data): ReviewTaskMachineContextReviewData {
        const schema = {
            summary: "",
            verification: "",
            report: "",
            sources: [],
            questions: [],
        };
        const questions = [];

        for (const cardContent of data?.content) {
            if (EditorSchemaArray?.includes(cardContent?.type)) {
                if (cardContent?.type === "questions") {
                    for (const { content } of cardContent.content) {
                        if (content) {
                            const questionTexts = content?.map(
                                ({ text }) => text
                            );
                            questions.push(...questionTexts);
                        }
                    }
                }
                schema[cardContent.type] = this.getSchemaContentBasedOnType(
                    schema,
                    cardContent
                );
            }
        }

        schema.sources = this.replaceSourceContentToTextRange(schema);
        schema.questions = questions;

        return schema;
    }

    getSchemaContentBasedOnType(
        schema,
        { type, content: cardContent }: RemirrorJSON
    ) {
        const sourceContent = [];
        for (const { content } of cardContent) {
            if (content) {
                for (const { text, marks } of content) {
                    if (marks) {
                        schema.sources.push(
                            ...this.getSourcesFromEditorMarks(text, type, marks)
                        );
                    }
                    sourceContent.push(text);
                }
            }
        }
        return sourceContent.join("");
    }

    getSourcesFromEditorMarks(text, field, marks) {
        return marks.map(({ attrs }: ObjectMark) => ({
            field,
            href: attrs.href,
            textRange: text,
        }));
    }

    replaceSourceContentToTextRange(schema) {
        const newSources = [];

        for (const key in schema) {
            schema.sources.forEach(({ field, href, textRange }) => {
                if (field === key) {
                    newSources.push({
                        field,
                        href,
                        textRange: this.findTextRange(schema[field], textRange),
                    });
                }
            });
        }
        return newSources;
    }

    findTextRange(content, textTarget) {
        const start = content.indexOf(textTarget);
        const end = start + textTarget.length;
        return [start, end];
    }

    async schema2editor(
        data: ReviewTaskMachineContextReviewData
    ): Promise<RemirrorJSON> {
        const doc: RemirrorJSON = {
            type: "doc",
            content: [
                /** Always add first line empty to
                 * prevent no position before top-level node errors
                 * when adding node extensions.
                 */
                { type: "paragraph", content: [{ type: "text", text: " " }] },
            ],
        };
        for (const key in data) {
            if (EditorSchemaArray.includes(key)) {
                const content = data[key];
                if (!this.reportHasSources(data)) {
                    doc.content.push(
                        ...this.buildContentWithoutSouces(key, content)
                    );
                    continue;
                }
                const sources = this.getSourceByProperty(data.sources, key);

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

    getContentObject(text): RemirrorJSON {
        return {
            type: "text",
            /**
             * https://remirror.io/docs/errors/#rmr0021
             * The text can not be a empty string,
             * because it is not supported by remirror.
             * */
            text: text === "" ? " " : text,
        };
    }

    getContentObjectWithMarks(content, href): RemirrorJSON {
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

    getParagraphFragments(rawSourcesRanges, sourcesRanges, content) {
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

        return {
            type: "paragraph",
            content: textFragments,
        };
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
                    content: [
                        this.getParagraphFragments(
                            rawSourcesRanges,
                            sourcesRanges,
                            c
                        ),
                    ],
                };
            });
        } else {
            return [
                {
                    type: key,
                    content: [
                        this.getParagraphFragments(
                            rawSourcesRanges,
                            sourcesRanges,
                            content
                        ),
                    ],
                },
            ];
        }
    }
}
