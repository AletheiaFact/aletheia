import React, { useEffect, useMemo } from "react";
import Head from "next/head";
import "../styles/app.css";
import { Provider } from "react-redux";
import { GlobalMessage } from "../components/Messages";
import { SessionExpiredModal } from "../components/SessionExpiredModal";
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
    isAuthResolved,
} from "../atoms/currentUser";
import { GetUserRole } from "../utils/GetUserRole";
import { AletheiaThemeConfig } from "../styles/namespaceThemes";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";
import { featureFlagsAtom } from "../atoms/featureFlags";
import {
    NextIntlClientProvider,
    useTranslations,
} from "next-intl";

function AppContent({ Component, pageProps }) {
    const store = useStore();

    const tSeo = useTranslations("seo");
    const tCookieConsent = useTranslations("cookieConsent");

    const setCurrentRole = useSetAtom(currentUserRole);
    const setCurrentLoginStatus = useSetAtom(isUserLoggedIn);
    const setCurrentUserId = useSetAtom(currentUserId);
    const setCurrentLevelAuthentication = useSetAtom(currentAuthentication);
    const setAuthResolved = useSetAtom(isAuthResolved);
    const setFeatureFlags = useSetAtom(featureFlagsAtom);

    const [nameSpace] = useAtom(currentNameSpace);

    const safeNamespace = nameSpace || NameSpaceEnum.Main;
    const getUserRole = GetUserRole();

    const namespaceTheme = useMemo(
        () => AletheiaThemeConfig(safeNamespace),
        [safeNamespace]
    );

    useEffect(() => {
        if (pageProps.enableEventsFeature !== undefined) {
            setFeatureFlags({
                enableEventsFeature: pageProps.enableEventsFeature,
            });
        }
    }, [pageProps.enableEventsFeature, setFeatureFlags]);

    useEffect(() => {
        getUserRole().then(({ role, isLoggedIn, id, aal }) => {
            setCurrentRole(role);
            setCurrentLoginStatus(isLoggedIn);
            setCurrentUserId(id);
            setCurrentLevelAuthentication(aal);
            setAuthResolved(true);
        });
    }, [getUserRole]);
    return (
        <>
            <Head>
                <title>{tSeo("siteName")}</title>

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
                        data-website-id={umamiConfig.UMAMI_SITE_ID}
                        src="https://analytics.aletheiafact.org/script.js"
                    />
                )}
            </Head>
            <Provider store={store}>
                <ThemeProvider theme={namespaceTheme}>
                    <GlobalMessage />
                    <SessionExpiredModal />
                    <CssBaseline />

                    <MainApp>
                        <DefaultSeo
                            titleTemplate={`%s | ${tSeo("siteName")}`}
                            defaultTitle={tSeo("siteName")}
                            openGraph={{
                                type: "website",
                                url: pageProps.href,
                                site_name: tSeo("siteName"),
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
                            buttonText={tCookieConsent("button")}
                            cookieName="termsAgreementCookie"
                            style={{
                                background: colors.neutral,
                            }}
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
                            {tCookieConsent.rich("text", {
                                privacyLink: (chunks) => (
                                    <a
                                        style={{ whiteSpace: "pre-wrap" }}
                                        href="/privacy-policy"
                                    >
                                        {chunks}
                                    </a>
                                ),
                                conductLink: (chunks) => (
                                    <a
                                        style={{ whiteSpace: "pre-wrap" }}
                                        href="/code-of-conduct"
                                    >
                                        {chunks}
                                    </a>
                                ),
                            })}
                        </CookieConsent>
                    </MainApp>
                </ThemeProvider>
            </Provider>
        </>
    );
}

function MyApp({ Component, pageProps }) {
    return (
        <NextIntlClientProvider
            locale={pageProps.locale ?? "pt"}
            messages={pageProps.messages ?? {}}
        >
            <AppContent
                Component={Component}
                pageProps={pageProps}
            />
        </NextIntlClientProvider>
    );
}

export default MyApp;