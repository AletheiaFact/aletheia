// IMPORTANT: Import tracing first to initialize OpenTelemetry before other modules
import "../utils/tracing-browser";
import React, { useMemo } from "react";
import Head from "next/head";
import "../styles/app.css";
import { appWithTranslation, Trans, useTranslation } from "next-i18next";
import { Provider } from "react-redux";
import { GlobalMessage } from "../components/Messages";
import { useStore } from "../store/store";
import MainApp from "../components/MainApp";
import * as umamiConfig from "../lib/umami";
import CookieConsent from "react-cookie-consent";
import colors from "../styles/colors";
import { DefaultSeo } from "next-seo";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import {
    currentAuthentication,
    currentUserId,
    currentUserRole,
    isUserLoggedIn,
} from "../atoms/currentUser";
import { GetUserRole } from "../utils/GetUserRole";
import { AletheiaThemeConfig } from "../styles/namespaceThemes";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";

function MyApp({ Component, pageProps }) {
    const store = useStore();
    const { t } = useTranslation();
    const setCurrentRole = useSetAtom(currentUserRole);
    const setCurrentLoginStatus = useSetAtom(isUserLoggedIn);
    const setCurrentUserId = useSetAtom(currentUserId);
    const setCurrentLevelAuthentication = useSetAtom(currentAuthentication);

    const [nameSpace] = useAtom(currentNameSpace);
    const safeNamespace = nameSpace || NameSpaceEnum.Main;
    const namespaceTheme = useMemo(() => AletheiaThemeConfig(safeNamespace), [safeNamespace]);

    GetUserRole().then(({ role, isLoggedIn, id, aal }) => {
        setCurrentRole(role);
        setCurrentLoginStatus(isLoggedIn);
        setCurrentUserId(id);
        setCurrentLevelAuthentication(aal);
    });

    return (
        <>
            <Head>
                <title>{t("seo:siteName")}</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta
                    httpEquiv="Content-Type"
                    content="text/html; charset=utf-8"
                />
                <meta
                    name="google-site-verification"
                    content="hM4P5Iyoy9bojyEm1AhZF5O5ZSCtScgyXwFDHdrcnFI"
                />
                {umamiConfig?.UMAMI_SITE_ID && (
                    <script
                        async
                        defer
                        data-website-id={umamiConfig?.UMAMI_SITE_ID}
                        src="https://analytics.aletheiafact.org/script.js"
                    ></script>
                )}
            </Head>
            <Provider store={store}>
                <ThemeProvider theme={namespaceTheme}>
                    <GlobalMessage />
                    <CssBaseline />
                    <MainApp>
                        <DefaultSeo
                            titleTemplate={`%s | ${t("seo:siteName")}`}
                            defaultTitle={t("seo:siteName")}
                            openGraph={{
                                type: "website",
                                url: pageProps.href,
                                site_name: t("seo:siteName"),
                                images: [
                                    {
                                        url: "https://pbs.twimg.com/profile_images/1426648783614619651/p43eLo43_400x400.jpg",
                                        width: 90,
                                        height: 90,
                                        alt: "aletheiaFact logo",
                                        type: "image/jpg",
                                    },
                                ],
                            }}
                            twitter={{
                                site: "@aletheiafact",
                                cardType: "summary",
                            }}
                        />
                        <Component {...pageProps} />
                        <CookieConsent
                            location="bottom"
                            buttonText={t("cookieConsent:button")}
                            cookieName="termsAgreementCookie"
                            style={{ background: colors.neutral }}
                            buttonStyle={{
                                background: colors.white,
                                color: colors.primary,
                                fontSize: "13px",
                                borderWidth: "2px",
                                borderRadius: "30px",
                                borderColor: colors.white,
                                padding: "10px 15px",
                                marginRight: "100px",
                            }}
                            expires={150}
                        >
                            <Trans
                                i18nKey={"cookieConsent:text"}
                                components={[
                                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                                    <a
                                        style={{ whiteSpace: "pre-wrap" }}
                                        href="/privacy-policy"
                                    ></a>,
                                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                                    <a
                                        style={{ whiteSpace: "pre-wrap" }}
                                        href="/code-of-conduct"
                                    ></a>,
                                ]}
                            />
                        </CookieConsent>
                    </MainApp>
                </ThemeProvider>
            </Provider>
        </>
    );
}

export default appWithTranslation(MyApp);
