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
        const { language } = this.props as { language?: string };
        return (
            <Html lang={language}>
                <Head>
                    {/* Preload only the woff2 faces used above the fold. Do not
                        preload the .woff fallbacks (legacy browsers) or add more
                        preload links: every preload is downloaded unconditionally.
                        See src/styles/fontfaces.ts for the @font-face rules. */}
                    <link
                        href="/fonts/Noticia_Text/noticiatext-regular-latin.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Noticia_Text/noticiatext-bold-latin.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-regular-latin.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-semibold-latin.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-bold-latin.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="/fonts/Open_Sans/opensans-extrabold-latin.woff2"
                        rel="preload"
                        as="font"
                        type="font/woff2"
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
