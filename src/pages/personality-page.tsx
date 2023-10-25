import { NextPage } from "next";
import PersonalityView from "../components/Personality/PersonalityView";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import JsonLd from "../components/JsonLd";
import { GetLocale } from "../utils/GetLocale";
import AffixButton from "../components/AffixButton/AffixButton";
import AdminToolBar from "../components/Toolbar/AdminToolBar";
import { useAtom, useSetAtom } from "jotai";
import { currentUserRole } from "../atoms/currentUser";
import { Roles, TargetModel } from "../types/enums";
import personalitiesApi from "../api/personality";
import { useDispatch } from "react-redux";
import actions from "../store/actions";
import { useEffect } from "react";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/namespace";

const PersonalityPage: NextPage<{
    personality: any;
    href: any;
    personalities: any[];
    sitekey: string;
    hideDescriptions: object;
    nameSpace: NameSpaceEnum;
}> = ({
    personality,
    href,
    personalities,
    sitekey,
    hideDescriptions,
    nameSpace,
}) => {
    const [role] = useAtom(currentUserRole);
    const dispatch = useDispatch();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);

    useEffect(() => {
        dispatch(actions.setSitekey(sitekey));
    }, [dispatch, sitekey]);

    const jsonldContent = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: personality.name,
        jobTitle: personality.description,
        image: personality.image,
    };
    return (
        <>
            <JsonLd {...jsonldContent} />
            {(role === Roles.SuperAdmin || role === Roles.Admin) && (
                <AdminToolBar
                    content={personality}
                    deleteApiFunction={personalitiesApi.deletePersonality}
                    changeHideStatusFunction={
                        personalitiesApi.updatePersonalityHiddenStatus
                    }
                    target={TargetModel.Personality}
                    hideDescriptions={hideDescriptions}
                />
            )}
            <PersonalityView
                personality={personality}
                href={href}
                personalities={personalities}
            />
            <AffixButton personalitySlug={personality.slug} />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
            personalities: JSON.parse(JSON.stringify(query.personalities)),
            hideDescriptions: JSON.parse(
                JSON.stringify(query.hideDescriptions)
            ),
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            sitekey: query.sitekey,
        },
    };
}
export default PersonalityPage;
