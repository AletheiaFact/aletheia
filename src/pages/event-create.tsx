import { useSetAtom } from "jotai";
import { NextPage } from "next";
import { useDispatch } from "react-redux";
import Seo from "../components/Seo";
import actions from "../store/actions";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { currentNameSpace } from "../atoms/namespace";
import CreateEventView from "../components/Event/EventForm/CreateEventView";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const CreateEventPage: NextPage<{
    nameSpace: NameSpaceEnum;
    sitekey: string;
}> = ({ nameSpace, sitekey }) => {
    const tSeo = useTranslations("seo");
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);

    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));

    return (
        <>
            <Seo
                title={tSeo("createEventTitle")}
                description={tSeo("createEventDescription")}
            />
            <CreateEventView />
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
export default CreateEventPage;
