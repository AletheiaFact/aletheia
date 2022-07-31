import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import React from "react";
const parser = require("accept-language-parser");

React.useLayoutEffect =
    typeof document !== "undefined" ? React.useLayoutEffect : React.useEffect;

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;
        const languages = parser.parse(ctx?.req?.language);
        const language =
            Array.isArray(languages) && languages.length >= 1
                ? languages[0]?.code
                : "pt";

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                language,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }

    render() {
        // @ts-ignore
        const { language } = this.props;
        return (
            <Html lang={language}>
                <Head>
                    <link
                        href="/fonts/Noticia_Text/noticiatext-regular-webfont.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Noticia_Text/noticiatext-bold-webfont.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-regular-webfont-webfont.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-bold-webfont-webfont.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-semibold-webfont-webfont.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-extrabold-webfont-webfont.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Noticia_Text/noticiatext-regular-webfont.woff"
                        rel="preload"
                        as="font"
                        type="font/woff"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Noticia_Text/noticiatext-bold-webfont.woff"
                        rel="preload"
                        as="font"
                        type="font/woff"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-regular-webfont-webfont.woff"
                        rel="preload"
                        as="font"
                        type="font/woff"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-bold-webfont-webfont.woff"
                        rel="preload"
                        as="font"
                        type="font/woff"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-semibold-webfont-webfont.woff"
                        rel="preload"
                        as="font"
                        type="font/woff"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-extrabold-webfont-webfont.woff"
                        rel="preload"
                        as="font"
                        type="font/woff"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Noticia_Text/NoticiaText-Regular.ttf"
                        rel="preload"
                        as="font"
                        type="font/ttf"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Noticia_Text/NoticiaText-Bold.ttf"
                        rel="preload"
                        as="font"
                        type="font/ttf"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/OpenSans-Regular.ttf"
                        rel="preload"
                        as="font"
                        type="font/ttf"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/OpenSans-SemiBold.ttf"
                        rel="preload"
                        as="font"
                        type="font/ttf"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/OpenSans-Bold.ttf"
                        rel="preload"
                        as="font"
                        type="font/ttf"
                        crossOrigin="anonymous"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
