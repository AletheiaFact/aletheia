import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";
import ClaimView from "../components/Claim/ClaimView";
import { GetLocale } from "../utils/GetLocale";
import JsonLd from "../components/JsonLd";
import { NextPage } from "next";
import Seo from "../components/Seo";
import actions from "../store/actions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";

export interface ClaimPageProps {
    personality: any;
    claim: any;
    sitekey: string;
    href: string;
    enableCollaborativeEditor: boolean;
    enableCopilotChatBot: boolean;
    enableEditorAnnotations: boolean;
    enableAddEditorSourcesWithoutSelecting: boolean;
    enableReviewersUpdateReport: boolean;
    enableViewReportPreview: boolean;
    hideDescriptions: object;
    websocketUrl: string;
    nameSpace: NameSpaceEnum;
}

const ClaimPage: NextPage<ClaimPageProps> = (props) => {
    const {
        personality,
        claim,
        sitekey,
        enableCollaborativeEditor,
        enableCopilotChatBot,
        enableEditorAnnotations,
        enableAddEditorSourcesWithoutSelecting,
        enableReviewersUpdateReport,
        enableViewReportPreview,
    } = props;
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    setCurrentNameSpace(props.nameSpace);

    dispatch(actions.setWebsocketUrl(props.websocketUrl));
    dispatch(actions.setSitekey(sitekey));
    dispatch(actions.closeCopilotDrawer());
    dispatch(
        actions.setEditorEnvironment(
            enableCollaborativeEditor,
            enableAddEditorSourcesWithoutSelecting,
            enableEditorAnnotations,
            enableCopilotChatBot,
            false,
            enableReviewersUpdateReport,
            enableViewReportPreview
        )
    );

    const jsonld = {
        "@context": "https://schema.org",
        "@type": "Claim",
        author: personality && {
            "@type": "Person",
            name: personality.name,
            jobTitle: personality.description,
            image: personality.image,
        },
        datePublished: claim.date,
        name: claim.title,
    };

    return (
        <>
            <Seo
                title={claim.title}
                description={t("seo:claimDescription", {
                    title: claim.title,
                    name: personality?.name || "",
                })}
            />
            <JsonLd {...jsonld} />
            <ClaimView {...props} />
            <AffixButton personalitySlug={personality?.slug} />
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
            personality: query.personality
                ? JSON.parse(JSON.stringify(query.personality))
                : null,
            claim: JSON.parse(JSON.stringify(query.claim)),
            hideDescriptions: query.hideDescriptions
                ? JSON.parse(JSON.stringify(query.personality))
                : null,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            sitekey: query.sitekey,
            enableCollaborativeEditor: query?.enableCollaborativeEditor,
            enableCopilotChatBot: query?.enableCopilotChatBot,
            enableEditorAnnotations: query?.enableEditorAnnotations,
            enableAddEditorSourcesWithoutSelecting:
                query?.enableAddEditorSourcesWithoutSelecting,
            enableViewReportPreview: query?.enableViewReportPreview,
            enableReviewersUpdateReport: query?.enableReviewersUpdateReport,
            websocketUrl: query.websocketUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default ClaimPage;
