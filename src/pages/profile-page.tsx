import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import OryProfileView from "../components/Profile/OryProfileView";
import ProfileView from "../components/Profile/ProfileView";
const parser = require("accept-language-parser");

const ProfilePage: NextPage<{ user }> = ({ user }) => {
    return <OryProfileView user={user} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            user: req.user ? JSON.parse(JSON.stringify(req.user)) : null,
        },
    };
}
export default ProfilePage;
