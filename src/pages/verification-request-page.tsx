import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { currentNameSpace } from "../atoms/namespace";
import { useSetAtom } from "jotai";
import AffixButton from "../components/AffixButton/AffixButton";
import VerificationRequestList from "../components/VerificationRequest/VerificationRequestList";

const VerificationRequestPage: NextPage<{ nameSpace }> = ({ nameSpace }) => {
    const { t } = useTranslation();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    return (
        <>
            <Seo
                title={t("seo:verificationRequestTitle")}
                description={t("seo:verificationRequestDescription")}
            />
            <VerificationRequestList />
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default VerificationRequestPage;
