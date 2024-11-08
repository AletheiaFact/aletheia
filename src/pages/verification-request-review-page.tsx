import AffixButton from "../components/AffixButton/AffixButton";
import { GetLocale } from "../utils/GetLocale";
import { NextPage } from "next";
import React from "react";
import { ReviewTaskMachineProvider } from "../machines/reviewTask/ReviewTaskMachineProvider";
import actions from "../store/actions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import ClaimReviewView from "../components/ClaimReview/ClaimReviewView";
import { ReviewTaskTypeEnum } from "../machines/reviewTask/enums";
import { VerificationRequestProvider } from "../components/VerificationRequest/VerificationRequestProvider";
import { VerificationRequest } from "../types/VerificationRequest";

export interface SourceReviewPageProps {
    verificationRequest: VerificationRequest;
    sitekey: string;
    reviewTask: any;
    hideDescriptions: object;
    websocketUrl: string;
    nameSpace: string;
    recommendations: VerificationRequest[];
}

const SourceReviewPage: NextPage<SourceReviewPageProps> = (props) => {
    const { verificationRequest, sitekey, hideDescriptions, recommendations } =
        props;
    const dispatch = useDispatch();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace as NameSpaceEnum);
    dispatch(actions.setWebsocketUrl(props.websocketUrl));
    dispatch(actions.setSitekey(sitekey));

    return (
        <>
            <ReviewTaskMachineProvider
                data_hash={verificationRequest.data_hash}
                baseMachine={props.reviewTask?.machine}
                baseReportModel={props?.reviewTask?.reportModel}
                reviewTaskType={ReviewTaskTypeEnum.VerificationRequest}
            >
                <VerificationRequestProvider
                    verificationRequest={verificationRequest}
                    baseRecommendations={recommendations}
                >
                    <ClaimReviewView
                        target={verificationRequest}
                        content={verificationRequest}
                        hideDescriptions={hideDescriptions}
                    />
                </VerificationRequestProvider>
            </ReviewTaskMachineProvider>
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
            verificationRequest: JSON.parse(
                JSON.stringify(query.verificationRequest)
            ),
            recommendations: JSON.parse(JSON.stringify(query.recommendations)),
            reviewTask: JSON.parse(JSON.stringify(query.reviewTask)),
            sitekey: query.sitekey,
            hideDescriptions: JSON.parse(
                JSON.stringify(query.hideDescriptions)
            ),
            websocketUrl: query?.websocketUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default SourceReviewPage;
