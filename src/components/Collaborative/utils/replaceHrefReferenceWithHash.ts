import md5 from "md5";

export default function replaceHrefReferenceWithHash(html: string) {
    const regex = /<a[^>]*>([^<]*)<\/a>/g;
    let sourceReference = 1;
    const replaceHrefReference = (match, text) => {
        const linkHashReference = md5(`$${text}${sourceReference}`);
        const modifiedTag = `<a href="#${linkHashReference}">${text}<sup>${sourceReference}</sup></a>`;
        sourceReference += 1;
        return modifiedTag;
    };

    return html.replace(regex, replaceHrefReference);
}