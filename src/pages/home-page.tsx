import { NextPage } from "next";

import AffixButton from "../components/AffixButton/AffixButton";
import Home from "../components/Home/Home";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const HomePage: NextPage<{
    personalities;
    stats;
    href;
    claims;
    nameSpace;
    reviews;
    eventsData;
    enableEventsFeature;
}> = (props) => {
    const tLandingPage = useTranslations("landingPage");
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace);
    return (
        <>
            <Seo title="Home" description={tLandingPage("description")} />
            <Home {...props} />
            <AffixButton enableEventsFeature={props.enableEventsFeature} />
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
            href:
                req.protocol +
                "://" +
                req.get("host") +
                req.originalUrl,
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personalities: JSON.parse(JSON.stringify(query.personalities)),
            reviews: JSON.parse(JSON.stringify(query.reviews)),
            eventsData: query.eventsData ? JSON.parse(JSON.stringify(query.eventsData)) : null,
            claims: JSON.parse(JSON.stringify(query.claims)),
            stats: JSON.parse(JSON.stringify(query.stats)),
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
            enableEventsFeature: query.enableEventsFeature === 'true' || query.enableEventsFeature === true,
        },
    };
}
export default HomePage;
