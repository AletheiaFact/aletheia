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
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="google-site-verification" content="hM4P5Iyoy9bojyEm1AhZF5O5ZSCtScgyXwFDHdrcnFI" />
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
                            images: [
                                {
                                    url: 'https://pbs.twimg.com/profile_images/1426648783614619651/p43eLo43_400x400.jpg',
                                    width: 90,
                                    height: 90,
                                    alt: 'aletheiaFact logo',
                                    type: 'image/jpg',
                                },
                            ],
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
                                // eslint-disable-next-line jsx-a11y/anchor-has-content
                                <a style={{ whiteSpace: "pre-wrap" }} href="/privacy-policy"></a>,
                                // eslint-disable-next-line jsx-a11y/anchor-has-content
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
