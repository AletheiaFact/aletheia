import {NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import LoginView from "../components/Login/LoginView";

const LoginPage: NextPage<{ data: any }> = (props) => {
    return <LoginView />
}

export async function getServerSideProps({ query, locale, req }) {
    locale = req.language || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    };
}

export default LoginPage;
