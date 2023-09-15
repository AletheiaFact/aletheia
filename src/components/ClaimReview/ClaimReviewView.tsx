import { useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { ContentModelEnum, Roles, TargetModel } from "../../types/enums";
import { reviewDataSelector } from "../../machines/reviewTask/selectors";
import SentenceReportView from "../SentenceReport/SentenceReportView";
import SocialMediaShare from "../SocialMediaShare";
import ClaimReviewForm from "./ClaimReviewForm";
import ClaimReviewHeader from "./ClaimReviewHeader";
import { Content } from "../../types/Content";
import { currentUserId, currentUserRole } from "../../atoms/currentUser";
import { useAtom } from "jotai";
import AdminToolBar from "../Toolbar/AdminToolBar";
import ClaimReviewApi from "../../api/claimReviewApi";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Fab from "../AffixButton/Fab";
import { AletheiaModal } from "../Modal/AletheiaModal.style";
import Banner from "../SentenceReport/Banner";
import { useTranslation } from "next-i18next";
import Cookies from "js-cookie";
import CtaAnimation from "../CtaAnimation";

export interface ClaimReviewViewProps {
    personality?: any;
    claim: any;
    content: Content;
    hideDescriptions: any;
}

const ClaimReviewView = (props: ClaimReviewViewProps) => {
    const { t } = useTranslation();
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const { review } = publishedReview || {};

    const reviewData = useSelector(machineService, reviewDataSelector);
    const [role] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [CTABannerShow, setCTABannerShow] = useState<boolean>(true);

    const userIsNotRegular = !(role === Roles.Regular || role === null);
    const userIsReviewer = reviewData.reviewerId === userId;
    const userIsAssignee = reviewData.usersId.includes(userId);

    const { personality, claim, content, hideDescriptions } = props;
    const isContentImage = claim.contentModel === ContentModelEnum.Image;

    const origin =
        typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "";

    let contentPath = personality
        ? `/personality/${personality?.slug}/claim`
        : `/claim`;
    contentPath += isContentImage
        ? `/${claim?._id}`
        : `/${claim?.slug}/sentence/${content.data_hash}`;
    const shareHref = `${origin}${contentPath}`;

    useEffect(() => {
        const CTABannerShow = Cookies.get("cta_banner_show") || true;
        if (CTABannerShow === true || CTABannerShow === "true") {
            return setCTABannerShow(true);
        }
        setCTABannerShow(false);
    }, []);

    const handleCTAClick = () => {
        setModalVisible(true);
        Cookies.set("cta_banner_show", "false");
        setCTABannerShow(false);
    };

    return (
        <div>
            {role === Roles.Admin && review?.isPublished && (
                <AdminToolBar
                    content={review}
                    deleteApiFunction={ClaimReviewApi.deleteClaimReview}
                    changeHideStatusFunction={
                        ClaimReviewApi.updateClaimReviewHiddenStatus
                    }
                    target={TargetModel.ClaimReview}
                    hideDescriptions={hideDescriptions}
                />
            )}
            <ClaimReviewHeader
                classification={
                    review?.report?.classification || reviewData?.classification
                }
                hideDescription={hideDescriptions}
                userIsReviewer={userIsReviewer}
                userIsNotRegular={userIsNotRegular}
                userIsAssignee={userIsAssignee}
                {...props}
            />
            <SentenceReportView
                context={review?.report || reviewData}
                userIsNotRegular={userIsNotRegular}
                userIsReviewer={userIsReviewer}
                isHidden={review?.isHidden}
            />
            <ClaimReviewForm
                claimId={claim._id}
                personalityId={personality?._id}
                dataHash={content.data_hash}
                userIsReviewer={userIsReviewer}
            />
            <SocialMediaShare
                quote={personality?.name}
                href={shareHref}
                claim={claim?.title}
            />

            {CTABannerShow && (
                <div
                    style={{
                        position: "fixed",
                        top: "15%",
                        right: "0%",
                        display: "flex",
                        flexDirection: "column-reverse",
                        alignItems: "center",
                        gap: "1rem",
                        zIndex: 9999,
                    }}
                >
                    <CtaAnimation pulse={!CTABannerShow}>
                        <Fab
                            tooltipText={t("affix:affixCallToActionButton")}
                            size="60px"
                            onClick={handleCTAClick}
                            data-cy={"testFloatButton"}
                            icon={
                                <QuestionCircleOutlined
                                    style={{
                                        fontSize: "24px",
                                    }}
                                />
                            }
                        />
                    </CtaAnimation>
                </div>
            )}

            <AletheiaModal
                open={modalVisible}
                footer={null}
                title={t("NewCTARegistration:body")}
                onCancel={() => setModalVisible(false)}
                theme="dark"
                width={"75%"}
            >
                <Banner />
            </AletheiaModal>
        </div>
    );
};

export default ClaimReviewView;
