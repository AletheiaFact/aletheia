import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import OrySignUpView from "../components/oryAuth/OrySignUpView";
const parser = require('accept-language-parser');

const OrySignUpPage: NextPage<{ data: any }> = (props) => {
    return <OrySignUpView {...props} />
}

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            flow: query.flow
        },
    };
}

export default OrySignUpPage;
