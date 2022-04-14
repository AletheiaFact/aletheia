import React from "react";
import Head from "next/head";
import "../styles/app.css"
import "antd/dist/antd.css";
import { appWithTranslation, Trans, useTranslation } from 'next-i18next';
import { Provider } from "react-redux";
import { useStore } from "../store/store";
import MainApp from "../components/MainApp";
import * as umami from "../lib/umami";
import CookieConsent from "react-cookie-consent";
import colors from "../styles/colors";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps }) {
    const store = useStore();
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>AletheiaFact.org</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                {umami.UMAMI_SITE_ID && (
                    <script async defer data-website-id={umami.UMAMI_SITE_ID} src="https://analytics.aletheiafact.org/umami.js"></script>
                )}
            </Head>
            <Provider store={store}>
                <MainApp>
                    <DefaultSeo
                        titleTemplate={`%s | AletheiaFact.org`}
                        defaultTitle={`AletheiaFact.org`}
                        openGraph={{
                            type: 'website',
                            url: pageProps.href,
                            site_name: 'AletheiaFact.org',
                        }}
                        twitter={{
                            site: '@aletheiafact',
                            cardType: 'summary',
                        }}
                    />
                    <Component {...pageProps} />
                    <CookieConsent
                        location="bottom"
                        buttonText={t("cookieConsent:button")}
                        cookieName="termsAgreementCookie"
                        style={{ background: colors.bluePrimary }}
                        buttonStyle={{
                            background: colors.white,
                            color: colors.bluePrimary,
                            fontSize: "13px",
                            borderWidth: "2px",
                            borderRadius: "30px",
                            borderColor: colors.white,
                            padding: "10px 15px"
                        }}
                        expires={150}
                    >
                        <Trans
                            i18nKey={"cookieConsent:text"}
                            components={[
                                <a style={{ whiteSpace: "pre-wrap" }} href="/privacy-policy"></a>,
                                <a style={{ whiteSpace: "pre-wrap" }} href="/code-of-conduct"></a>
                            ]}
                        />
                    </CookieConsent>
                </MainApp>
            </Provider>
        </>
    );
}

export default appWithTranslation(MyApp);
