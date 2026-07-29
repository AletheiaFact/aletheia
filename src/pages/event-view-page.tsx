import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { EventPayload } from "../types/event";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { GetLocale } from "../utils/GetLocale";
import { useDispatch } from "react-redux";
import actions from "../store/actions";
import EventView from "../components/Event/EventView/EventView";
import AffixButton from "../components/AffixButton/AffixButton";
import { CaptchaClientConfig } from "../types/Captcha";

interface EventPageProps {
    event: EventPayload;
    nameSpace: NameSpaceEnum;
    sitekey: string;
    captcha: CaptchaClientConfig;
}

const EventViewPage: NextPage<EventPageProps> = ({
    event,
    nameSpace,
    sitekey,
    captcha,
}) => {
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);

    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));
    dispatch(actions.setCaptchaConfig(captcha));

    return (
        <main>
            <EventView event={event} nameSpace={nameSpace} />
            <AffixButton />
        </main>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            event: query.event || null,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
            sitekey: query.sitekey,
            captcha: query.captcha,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default EventViewPage;
