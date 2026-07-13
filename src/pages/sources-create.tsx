import { useSetAtom } from "jotai";
import { NextPage } from "next";
import { useDispatch } from "react-redux";
import Seo from "../components/Seo";
import actions from "../store/actions";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { currentNameSpace } from "../atoms/namespace";
import CreateSourceView from "../components/Source/CreateSource/CreateSourceView";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const CreateSourcesPage: NextPage<any> = ({ sitekey, nameSpace }) => {
    const tSeo = useTranslations("seo");
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));
    return (
        <>
            <Seo
                title={tSeo("createSourceTitle")}
                description={tSeo("createSourceDescription")}
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
            locale,
            messages: await getMessages(locale),
            sitekey: query.sitekey,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default CreateSourcesPage;
