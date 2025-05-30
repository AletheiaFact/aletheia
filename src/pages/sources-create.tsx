import { useSetAtom } from "jotai";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import Seo from "../components/Seo";
import actions from "../store/actions";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { currentNameSpace } from "../atoms/namespace";
import CreateSourceView from "../components/Source/CreateSource/CreateSourceView";

const CreateSourcesPage: NextPage<any> = ({ sitekey, nameSpace }) => {
    const { t } = useTranslation();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));
    return (
        <>
            <Seo
                title={t("seo:createSourceTitle")}
                description={t("seo:createSourceDescription")}
            />
            <CreateSourceView />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            sitekey: query.sitekey,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default CreateSourcesPage;
