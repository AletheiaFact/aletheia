import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { GetLocale } from "../utils/GetLocale";
import { useDispatch } from "react-redux";
import actions from "../store/actions";
import EventsList from "../components/Event/EventList/EventsList";
import AffixButton from "../components/AffixButton/AffixButton";
import { CaptchaClientConfig } from "../types/Captcha";

const EventPage: NextPage<{
    nameSpace: NameSpaceEnum;
    sitekey: string;
    captcha: CaptchaClientConfig;
}> = ({ nameSpace, sitekey, captcha }) => {
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);

    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));
    dispatch(actions.setCaptchaConfig(captcha));

    return (
        <>
            <EventsList />
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
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
            sitekey: query.sitekey,
            captcha: query.captcha,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default EventPage;
