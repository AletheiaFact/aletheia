import {NextPage} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ProfileView from "../components/Profile/ProfileView";

const ProfilePage: NextPage<{ user }> = ({ user }) => {
    return (
        <ProfileView user={user}/>
    );
}

export async function getServerSideProps({ query, locale, req }) {
    locale = req.language || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            user: req.user ? JSON.parse(JSON.stringify(req.user)) : null,
        },
    };
}
export default ProfilePage;
