import { randomUUID } from "crypto";
import type { RemirrorJSON } from "remirror";
import { EditorParser } from "../../../lib/editor-parser";
import { ReviewTaskTypeEnum } from "../../types/enums";

/**
 * The review form in plain text, as MCP clients read and write it. The web
 * stores the same content twice: as text fields with `{{sourceId|text}}`
 * markup where a source is linked, and as the Remirror document
 * (`visualEditor`) the form editor loads. This module converts between the
 * two so a review written over MCP opens in the web form with its source
 * links, and a review written on the web reads back as plain text.
 */

export type ReviewLogField = "summary" | "report" | "verification";

export interface ReviewLogSource {
    href: string;
    field?: ReviewLogField;
    quotedText?: string;
}

export interface ReviewLog {
    classification?: string;
    summary?: string;
    questions?: string[];
    report?: string;
    verification?: string;
    sources?: ReviewLogSource[];
}

const TEXT_FIELDS: ReviewLogField[] = ["summary", "report", "verification"];

// `{{id|text}}`: the markup the web stores for a linked source.
const SOURCE_MARKUP = /{{[^|{}]+\|([^{}]+)}}/g;

// Stored text is rendered as HTML by schema2html, and `{{`/`}}` are the
// source markup delimiters, so neither may come from the client.
const FORBIDDEN_TEXT = /<[a-z!/?]|{{|}}/i;

const parser = new EditorParser();

export function stripSourceMarkup(text: string): string {
    return text.replace(SOURCE_MARKUP, "$1");
}

/** Stored `reviewData` → the plain review log. */
export function fromStored(reviewData: any = {}): ReviewLog {
    const text = (value: unknown) =>
        typeof value === "string" ? stripSourceMarkup(value) : "";
    const sources = (reviewData.sources ?? [])
        .map((source: any): ReviewLogSource | null => {
            if (typeof source === "string") {
                return { href: source };
            }
            if (!source?.href) {
                return null;
            }
            const field = source.props?.field ?? source.field;
            const quotedText = source.props?.targetText;
            return TEXT_FIELDS.includes(field) && quotedText
                ? { href: source.href, field, quotedText }
                : { href: source.href };
        })
        .filter(Boolean);
    return {
        classification: reviewData.classification || "",
        summary: text(reviewData.summary),
        questions: (reviewData.questions ?? []).map(text),
        report: text(reviewData.report),
        verification: text(reviewData.verification),
        sources,
    };
}

/** Problems that make `log` impossible to store; empty when it is valid. */
export function reviewLogErrors(log: ReviewLog): string[] {
    const errors: string[] = [];
    const texts: Record<string, string | undefined> = {
        summary: log.summary,
        report: log.report,
        verification: log.verification,
    };
    for (const [field, value] of Object.entries(texts)) {
        if (value && FORBIDDEN_TEXT.test(value)) {
            errors.push(`${field} must not contain HTML tags or "{{"/"}}"`);
        }
    }
    (log.questions ?? []).forEach((question, index) => {
        if (FORBIDDEN_TEXT.test(question)) {
            errors.push(
                `questions[${index}] must not contain HTML tags or "{{"/"}}"`
            );
        }
    });
    (log.sources ?? []).forEach((source, index) => {
        if (!source.quotedText) return;
        if (!source.field) {
            errors.push(`sources[${index}] has quotedText but no field`);
        } else if (!(texts[source.field] ?? "").includes(source.quotedText)) {
            errors.push(
                `sources[${index}].quotedText "${source.quotedText}" is not in ${source.field}`
            );
        }
    });
    return errors;
}

/** First occurrence of `needle` in `text` that is not inside source markup. */
function indexOutsideMarkup(text: string, needle: string): number {
    const taken = [...text.matchAll(SOURCE_MARKUP)].map((match) => [
        match.index!,
        match.index! + match[0].length,
    ]);
    let from = 0;
    for (;;) {
        const at = text.indexOf(needle, from);
        if (at === -1) return -1;
        const end = at + needle.length;
        if (!taken.some(([start, stop]) => at < stop && end > start)) {
            return at;
        }
        from = at + 1;
    }
}

/**
 * The plain review log → the fields, sources, editor document and HTML the
 * web stores in `reviewData`. Throws when `reviewLogErrors` is not empty.
 */
export function toStored(log: ReviewLog) {
    const errors = reviewLogErrors(log);
    if (errors.length) {
        throw new Error(errors.join("; "));
    }

    const fields: Record<ReviewLogField, string> = {
        summary: log.summary ?? "",
        report: log.report ?? "",
        verification: log.verification ?? "",
    };
    const questions = log.questions ?? [];

    // Link each quoted passage, in order, the way the editor marks a link.
    const sources = (log.sources ?? []).map((source, index) => {
        const id = randomUUID();
        const sup = index + 1;
        if (!source.quotedText || !source.field) {
            // Same shape as a source added with the editor's "add source"
            // button: listed with the review, not linked to a passage.
            return {
                href: source.href,
                props: {
                    field: null,
                    targetText: null,
                    id,
                    textRange: [0, 0],
                    sup,
                },
            };
        }
        const text = fields[source.field];
        const at = indexOutsideMarkup(text, source.quotedText);
        if (at === -1) {
            throw new Error(
                `sources[${index}].quotedText "${source.quotedText}" is already linked to another source in ${source.field}`
            );
        }
        fields[source.field] =
            text.slice(0, at) +
            `{{${id}|${source.quotedText}}}` +
            text.slice(at + source.quotedText.length);
        return {
            href: source.href,
            props: {
                field: source.field,
                targetText: source.quotedText,
                id,
                textRange: [] as number[],
                sup,
            },
        };
    });
    for (const source of sources) {
        if (source.props.field) {
            source.props.textRange = parser.findTextRange(
                fields[source.props.field],
                source.props.targetText,
                source.props.id
            );
        }
    }

    // The editor and HTML builders walk a field's passages in the order the
    // sources are listed, so list them in reading order (field by field,
    // then by position) and number them that way, as the web editor does.
    // Sources without a passage go last.
    const position = (source: typeof sources[number]) =>
        source.props.field
            ? [
                  TEXT_FIELDS.indexOf(source.props.field),
                  source.props.textRange[0],
              ]
            : [TEXT_FIELDS.length, 0];
    sources.sort((a, b) => {
        const [fieldA, startA] = position(a);
        const [fieldB, startB] = position(b);
        return fieldA - fieldB || startA - startB;
    });
    sources.forEach((source, index) => {
        source.props.sup = index + 1;
    });

    const schema = {
        summary: fields.summary,
        questions,
        report: fields.report,
        verification: fields.verification,
        sources,
    };
    return {
        ...schema,
        visualEditor: buildVisualEditor(schema),
        reviewDataHtml: parser.schema2html(schema as any),
    };
}

/**
 * The form's Remirror document: one card per field, one paragraph per line,
 * linked passages as `link` marks — the shape the web editor saves, so
 * `editor2schema` reads back the same fields and sources.
 */
function buildVisualEditor(schema: {
    summary: string;
    questions: string[];
    report: string;
    verification: string;
    sources: any[];
}): RemirrorJSON {
    const card = (field: ReviewLogField): RemirrorJSON => {
        const fieldSources = schema.sources
            .filter((source) => source.props.field === field)
            .map((source) => ({ ...source, type: "source" }));
        const paragraphs = schema[field].split("\n").map((line) => {
            const lineSources = fieldSources
                .map((source) => ({
                    ...source,
                    props: {
                        ...source.props,
                        textRange: parser.findTextRange(
                            line,
                            source.props.targetText,
                            source.props.id
                        ),
                    },
                }))
                .filter((source) => source.props.textRange.length === 2);
            return parser.getParagraphFragments(
                lineSources.map((source) => source.props.textRange),
                lineSources,
                line
            );
        });
        return { type: field, content: paragraphs };
    };
    const questions: RemirrorJSON = {
        type: "questions",
        content: schema.questions.length
            ? schema.questions.map((question) => ({
                  type: "paragraph",
                  content: [{ type: "text", text: question }],
              }))
            : [{ type: "paragraph" }],
    };
    return {
        type: "doc",
        attrs: { reviewTaskType: ReviewTaskTypeEnum.Claim },
        content: [
            card("summary"),
            questions,
            card("report"),
            card("verification"),
        ],
    };
}
