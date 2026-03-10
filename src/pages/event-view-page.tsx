import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FullEventResponse } from "../types/event";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { GetLocale } from "../utils/GetLocale";
import { useDispatch } from "react-redux";
import actions from "../store/actions";
import EventView from "../components/Event/EventView/EventView";

interface EventPageProps {
    fullEvent: FullEventResponse;
    nameSpace: NameSpaceEnum;
    sitekey: string;
}

const EventViewPage: NextPage<EventPageProps> = ({
    fullEvent,
    nameSpace,
    sitekey
}) => {
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);

    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));

    return (
        <main>
            <EventView
                fullEvent={fullEvent}
            />
        </main>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            fullEvent: query.fullEvent || null,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
            sitekey: query.sitekey,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default EventViewPage;
