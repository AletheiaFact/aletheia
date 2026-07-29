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
import CreateEventView from "../components/Event/EventForm/CreateEventView";
import { CaptchaClientConfig } from "../types/Captcha";

const CreateEventPage: NextPage<{
    nameSpace: NameSpaceEnum;
    sitekey: string;
    captcha: CaptchaClientConfig;
}> = ({ nameSpace, sitekey, captcha }) => {
    const { t } = useTranslation();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);

    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));
    dispatch(actions.setCaptchaConfig(captcha));

    return (
        <>
            <Seo
                title={t("seo:createEventTitle")}
                description={t("seo:createEventDescription")}
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
            ...(await serverSideTranslations(locale)),
            sitekey: query.sitekey,
            captcha: query.captcha,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default CreateEventPage;
