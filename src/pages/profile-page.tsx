import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import OryProfileView from "../components/Profile/OryProfileView";
const parser = require("accept-language-parser");

const ProfilePage: NextPage<{ user }> = ({ user }) => {
    return <OryProfileView user={user} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = req.cookies.default_language || parser.pick(locales, req.language) || locale || "pt";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            user: query.user ? JSON.parse(JSON.stringify(query.user)) : null,
            // user: req.user ? JSON.parse(JSON.stringify(req.user)) : null,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}
export default ProfilePage;
