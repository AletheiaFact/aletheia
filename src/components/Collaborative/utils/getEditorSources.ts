import md5 from "md5";

interface MarksProps {
    type: string;
    attrs: {
        href: string;
        target?: string;
        auto: boolean;
    };
}

interface ContentTextProps {
    type: string;
    marks: MarksProps[];
    text: string;
}

interface ContentParagraphsProps {
    content: ContentTextProps[];
    type: string;
}

export default function getEditorSources(content: ContentParagraphsProps[]) {
    let sourceReference = 0;
    return content
        .flatMap((paragraph) => {
            return paragraph?.content
                ?.filter((content) => content.marks)
                .map((content) => {
                    sourceReference += 1;
                    return {
                        targetText: content.text,
                        ref: md5(`$${content.text}${sourceReference}`),
                        href: content.marks[0].attrs.href,
                    };
                });
        })
        .filter((source) => source);
}
