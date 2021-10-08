import React from "react";
import Head from "next/head";
import "../styles/app.css"
import "antd/dist/antd.css";
import { appWithTranslation } from 'next-i18next';
import {Provider} from "react-redux";
import { useStore } from "../store/store";
import MainApp from "../components/MainApp";

function MyApp({ Component, pageProps }) {
    const store = useStore();
    return (
        <>
            <Head>
                <title>AletheiaFact.org</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
            </Head>
            <Provider store={store}>
                <MainApp>
                    <Component {...pageProps} />
                </MainApp>
            </Provider>
        </>
    );
}

export default appWithTranslation(MyApp);
