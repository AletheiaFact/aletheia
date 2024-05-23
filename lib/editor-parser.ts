import { ObjectMark, RemirrorJSON } from "remirror";
import { ReviewTaskMachineContextReviewData } from "../server/claim-review-task/dto/create-claim-review-task.dto";
import { ReportModelEnum } from "../server/types/enums";

type SchemaType = {
    summary?: string;
    verification?: string;
    report: string;
    sources: any[];
    questions?: any[];
};

const getEditorSchemaArray = (reportModel = ReportModelEnum.FactChecking) =>
    reportModel === ReportModelEnum.FactChecking
        ? ["summary", "report", "verification", "questions"]
        : ["report"];

const MarkupCleanerRegex = /{{[^|]+\|([^}]+)}}/;

const createParagraphBlock = (
    type: string
): { type: string; content: [{ type: "paragraph" }] } => ({
    type: type,
    content: [{ type: "paragraph" }],
});

const getDefaultDoc = (reportModel: string): RemirrorJSON => {
    const baseContent = [
        createParagraphBlock("summary"),
        createParagraphBlock("questions"),
        createParagraphBlock("report"),
        createParagraphBlock("verification"),
    ];

    if (reportModel === ReportModelEnum.InformativeNews) {
        return {
            type: "doc",
            content: [createParagraphBlock("report")],
        };
    }

    return {
        type: "doc",
        content: baseContent,
    };
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

        const parsedFragmentText = this.extractTextFromMarkUp(fragmentText);

        if (type === "source" && parsedFragmentText === targetText) {
            return `<a href='#${parsedFragmentText}' rel='noopener noreferrer nofollow'>${parsedFragmentText}<sup>${sup}</sup></a>`;
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
            if (getEditorSchemaArray().includes(key)) {
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
        const schema: SchemaType = {
            report: "",
            sources: [],
        };
        const questions = [];
        for (const cardContent of data?.content) {
            if (getEditorSchemaArray().includes(cardContent?.type)) {
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

        /**
         * Needed to do this conditional because the form validation when the reportModel
         * is equal to Informative news requires the questions field.
         */
        if (schema.summary || schema.verification) {
            schema.questions = questions;
        }
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
                        const markId = marks.map(
                            ({ attrs }: ObjectMark) => attrs.id
                        );

                        // Pushing the text into content with markup based on its source id
                        sourceContent.push(`{{${markId}|${text}}}`);
                    } else {
                        sourceContent.push(text);
                    }
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
                                textRange,
                                id
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

    findTextRange(content, textTarget, sourceId) {
        const contentArray = Array.isArray(content) ? content : [content];
        const markUpText = `{{${sourceId}|${textTarget}}}`;

        // Looks for the specific text with the right markup and returns the range of the marked-up text
        return contentArray.flatMap((c) => {
            const start = c.indexOf(markUpText);
            if (start !== -1) {
                const end = start + markUpText.length;
                return [start, end];
            }
            return [];
        });
    }

    async schema2editor(
        schema: ReviewTaskMachineContextReviewData,
        reportModel = ReportModelEnum.FactChecking
    ): Promise<RemirrorJSON> {
        if (!schema) {
            return getDefaultDoc(reportModel);
        }

        const doc: RemirrorJSON = {
            type: "doc",
            content: [],
        };
        for (const key of Object.keys(schema).filter((key) =>
            getEditorSchemaArray(reportModel).includes(key)
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

        const parsedFragmentText = this.extractTextFromMarkUp(fragmentText);

        switch (type) {
            case "text":
                if (fragmentText) {
                    return this.getContentObject(fragmentText);
                }
                break;
            case "source":
                if (parsedFragmentText === targetText) {
                    return this.getContentObjectWithMarks(
                        parsedFragmentText,
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

    extractTextFromMarkUp(fragmentText) {
        const match = fragmentText.match(MarkupCleanerRegex);
        return match ? match[1] : "";
    }
}
