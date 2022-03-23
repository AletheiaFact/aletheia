import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import OryLoginView from "../components/oryAuth/OryLoginView";
const parser = require('accept-language-parser');

const OryLoginPage: NextPage<{ data: any }> = (props) => {
    return <OryLoginView {...props} />
}

export async function getServerSideProps({ locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale))
        },
    };
}

export default OryLoginPage;
