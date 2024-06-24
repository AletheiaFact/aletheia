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

export interface SourceReviewPageProps {
    verificationRequest: any;
    sitekey: string;
    claimReviewTask: any;
    hideDescriptions: object;
    websocketUrl: string;
    nameSpace: string;
}

const SourceReviewPage: NextPage<SourceReviewPageProps> = (props) => {
    const { verificationRequest, sitekey, hideDescriptions } = props;
    const dispatch = useDispatch();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace as NameSpaceEnum);
    dispatch(actions.setWebsocketUrl(props.websocketUrl));
    dispatch(actions.setSitekey(sitekey));

    return (
        <>
            <ReviewTaskMachineProvider
                data_hash={verificationRequest.data_hash}
                baseMachine={props.claimReviewTask?.machine}
                baseReportModel={props?.claimReviewTask?.reportModel}
                reviewTaskType={ReviewTaskTypeEnum.VerificationRequest}
            >
                <ClaimReviewView
                    targetId={verificationRequest._id}
                    content={verificationRequest}
                    hideDescriptions={hideDescriptions}
                />
            </ReviewTaskMachineProvider>
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            verificationRequest: JSON.parse(
                JSON.stringify(query.verificationRequest)
            ),
            claimReviewTask: JSON.parse(JSON.stringify(query.claimReviewTask)),
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
