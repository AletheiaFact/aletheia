import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import OryProfileView from "../components/Profile/OryProfileView";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";

const ProfilePage: NextPage<{ user; nameSpace }> = ({ user, nameSpace }) => {
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    return <OryProfileView user={user} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            user: query.user ? JSON.parse(JSON.stringify(query.user)) : null,
            // user: req.user ? JSON.parse(JSON.stringify(req.user)) : null,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default ProfilePage;
