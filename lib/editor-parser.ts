import { ObjectMark, RemirrorJSON } from "remirror";
import { ReviewTaskMachineContextReviewData } from "../server/claim-review-task/dto/create-claim-review-task.dto";

const EditorSchemaArray = ["summary", "report", "verification", "questions"];

const defaultDoc: RemirrorJSON = {
    type: "doc",
    content: [
        {
            type: "summary",
            content: [{ type: "paragraph" }],
        },
        {
            type: "questions",
            content: [{ type: "paragraph" }],
        },
        {
            type: "report",
            content: [{ type: "paragraph" }],
        },
        {
            type: "verification",
            content: [{ type: "paragraph" }],
        },
    ],
};

export class EditorParser {
    hasSources(sources): boolean {
        return sources.length > 0;
    }

    getSourceByProperty(sources, property) {
        //FIXME: Create migration
        return sources.filter(
            (source) => (source?.props?.field || source?.field) === property
        );
    }

    buildHtmlContentWithoutSources(
        content: string | object[]
    ): string | string[] {
        if (Array.isArray(content)) {
            return content.map((c) => `<div><p>${c}</p></div>`);
        }

        return `<div><p>${content}</p></div>`;
    }

    extractHtmlContentFromRange({ props, content }, type = "text") {
        const { textRange, targetText, sup } = props;
        const fragmentText = content.slice(...textRange);
        if (type === "text") {
            return fragmentText;
        }

        if (type === "source" && fragmentText === targetText) {
            return `<a href='#${fragmentText}' rel='noopener noreferrer nofollow'>${fragmentText}<sup>${sup}</sup></a>`;
        }
        return fragmentText;
    }

    getHtmlContent(rawSourcesRanges, sourcesRanges, content, key) {
        const allRanges = this.getAllTextRanges(
            rawSourcesRanges,
            sourcesRanges,
            content
        );

        const htmlContent = allRanges.map(({ props, type }) => {
            return this.extractHtmlContentFromRange(
                {
                    content,
                    props,
                },
                type
            );
        });

        if (key === "questions") {
            return htmlContent.join("");
        }

        return `<div><p>${htmlContent.join("")}</p></div>`;
    }

    buildHtmlContent({ content, rawSourcesRanges, sourcesRanges, key }) {
        if (Array.isArray(content)) {
            return content.map((c) => {
                return this.getHtmlContent(
                    rawSourcesRanges,
                    sourcesRanges,
                    c,
                    key
                );
            });
        } else {
            return this.getHtmlContent(
                rawSourcesRanges,
                sourcesRanges,
                content,
                key
            );
        }
    }

    schema2html(
        schema: ReviewTaskMachineContextReviewData
    ): ReviewTaskMachineContextReviewData {
        const newSchema = {
            ...schema,
        };

        const hasSources = this.hasSources(newSchema?.sources);

        for (const key in newSchema) {
            if (EditorSchemaArray.includes(key)) {
                const content = newSchema[key];
                if (!hasSources) {
                    newSchema[key] =
                        this.buildHtmlContentWithoutSources(content);
                    continue;
                }
                const sources = this.getSourceByProperty(
                    newSchema.sources,
                    key
                );

                const { rawSourcesRanges, sourcesRanges } =
                    this.getRawSourcesAndSourcesRanges(sources);

                newSchema[key] = this.buildHtmlContent({
                    content,
                    sourcesRanges,
                    rawSourcesRanges,
                    key,
                });
            }
        }

        return newSchema;
    }

    editor2schema(data: RemirrorJSON): ReviewTaskMachineContextReviewData {
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
                            questions.push(...[questionTexts.join("")]);
                        }
                    }
                }
                schema[cardContent.type] = this.getSchemaContentBasedOnType(
                    schema,
                    cardContent
                );
            }
        }

        schema.questions = questions;
        schema.sources = this.replaceSourceContentToTextRange(schema);

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
            href: attrs.href,
            props: {
                field,
                textRange: text,
                id: attrs.id,
            },
        }));
    }

    replaceSourceContentToTextRange(schema) {
        const newSources = [];

        for (const key in schema) {
            schema.sources.forEach(({ props, href }, index) => {
                const { field, textRange, id } = props;
                if (field === key) {
                    newSources.push({
                        href,
                        props: {
                            field,
                            textRange: this.findTextRange(
                                schema[field],
                                textRange
                            ),
                            targetText: textRange,
                            sup: index + 1,
                            id,
                        },
                    });
                }
            });
        }
        return newSources.sort((a, b) => a.sup - b.sup);
    }

    findTextRange(content, textTarget) {
        const contentArray = Array.isArray(content) ? content : [content];

        return contentArray.flatMap((c) => {
            const start = c.indexOf(textTarget);
            if (start !== -1) {
                const end = start + textTarget.length;
                return [start, end];
            }
            return [];
        });
    }

    async schema2editor(
        schema: ReviewTaskMachineContextReviewData
    ): Promise<RemirrorJSON> {
        if (!schema) {
            return defaultDoc;
        }

        const doc: RemirrorJSON = {
            type: "doc",
            content: [],
        };
        for (const key of Object.keys(schema).filter((key) =>
            EditorSchemaArray.includes(key)
        )) {
            const content = schema[key];
            if (!this.hasSources(schema?.sources)) {
                doc.content.push(
                    ...this.buildContentWithoutSouces(key, content)
                );
                continue;
            } else {
                const sources = this.getSourceByProperty(schema.sources, key);
                const { rawSourcesRanges, sourcesRanges } =
                    this.getRawSourcesAndSourcesRanges(sources);
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

    getRawSourcesAndSourcesRanges(sources) {
        const rawSourcesRanges = sources.map(({ props }) => props.textRange);

        const sourcesRanges = sources.map((source) => {
            return {
                ...source,
                type: "source",
            };
        });

        return {
            rawSourcesRanges,
            sourcesRanges,
        };
    }

    extractContentFragmentFromRange(
        { props, content, href = null },
        type = "text"
    ) {
        const { textRange, targetText, id } = props;
        const fragmentText = content.slice(...textRange);

        switch (type) {
            case "text":
                if (fragmentText) {
                    return this.getContentObject(fragmentText);
                }
                break;
            case "source":
                if (fragmentText === targetText) {
                    return this.getContentObjectWithMarks(
                        fragmentText,
                        href,
                        id
                    );
                }
            // Fall through to the default case if type is "source" and the text doesn't match targetText
            default:
                if (fragmentText) {
                    return this.getContentObject(fragmentText);
                }
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
            text,
        };
    }

    getContentObjectWithMarks(content, href, id): RemirrorJSON {
        return {
            ...this.getContentObject(content),
            marks: [
                {
                    type: "link",
                    attrs: {
                        href: href,
                        target: null,
                        auto: false,
                        id,
                    },
                },
            ],
        };
    }

    getAllTextRanges(rawSourcesRanges, sourcesRanges, content) {
        const missingTextRanges = this.getMissingRanges(
            rawSourcesRanges,
            content.length
        ).map((textRange) => {
            return {
                props: {
                    textRange,
                },
                type: "text",
            };
        });

        return [...sourcesRanges, ...missingTextRanges].sort((a, b) => {
            return a.props.textRange[0] - b.props.textRange[0];
        });
    }

    getParagraphFragments(rawSourcesRanges, sourcesRanges, content) {
        if (content === "") {
            return { type: "paragraph" };
        }
        const allRanges = this.getAllTextRanges(
            rawSourcesRanges,
            sourcesRanges,
            content
        );

        const textFragments = allRanges
            .map(({ props, type, href }) => {
                return this.extractContentFragmentFromRange(
                    {
                        props,
                        content,
                        href,
                    },
                    type
                );
            })
            .filter((fragment) => fragment !== undefined);

        return {
            type: "paragraph",
            content: textFragments,
        };
    }

    buildContentWithoutSouces(key, content): RemirrorJSON[] {
        const isEmpty = content === "";
        const contentArray = Array.isArray(content) ? content : [content];

        return contentArray.map((c) => ({
            type: key,
            content: isEmpty
                ? [{ type: "paragraph" }]
                : [
                      {
                          type: "paragraph",
                          content: [this.getContentObject(c)],
                      },
                  ],
        }));
    }

    buildContentFragments({
        content,
        key,
        rawSourcesRanges,
        sourcesRanges,
    }): RemirrorJSON[] {
        const contentArray = Array.isArray(content) ? content : [content];

        return contentArray.map((c) => ({
            type: key,
            content: [
                this.getParagraphFragments(rawSourcesRanges, sourcesRanges, c),
            ],
        }));
    }
}
