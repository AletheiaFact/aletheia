import md5 from "md5";

export default function getEditorSources(content) {
    let sourceReference = 0;
    return content.JSON.content
        .flatMap((paragraph) => {
            return paragraph?.content
                ?.filter((content) => content.marks)
                .map((content) => {
                    sourceReference += 1;
                    return {
                        targetText: content.text,
                        ref: md5(`$${content.text}${sourceReference}`),
                        link: content.marks[0].attrs.href,
                    };
                });
        })
        .filter((source) => source);
}
