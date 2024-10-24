import React from "react";
import BaseList from "../List/BaseList";
import personalitiesApi from "../../api/personality";
import { useTranslation } from "next-i18next";
import PersonalityCard from "../Personality/PersonalityCard";
import PersonalitySkeleton from "../Skeleton/PersonalitySkeleton";
import { Col } from "antd";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";
import claimApi from "../../api/claim";
import ClaimCard from "../Claim/ClaimCard";
import claimReviewApi from "../../api/claimReviewApi";
import DashboardViewStyle from "./DashboardView.style";
import ReviewCard from "../ClaimReview/ReviewCard";

const DashboardView = () => {
    const { t, i18n } = useTranslation();

    return (
        <DashboardViewStyle justify="space-around">
            <Col className="dashboard-item" sm={24} md={11} lg={7}>
                <BaseList
                    title={t("admin:dashboardHiddenPersonalities")}
                    apiCall={personalitiesApi.getPersonalities}
                    filter={{
                        i18n,
                        isHidden: true,
                    }}
                    emptyFallback={<></>}
                    renderItem={(p) =>
                        p && (
                            <PersonalityCard
                                personality={p}
                                summarized={true}
                                key={p._id}
                            />
                        )
                    }
                    skeleton={<PersonalitySkeleton />}
                />
            </Col>

            <Col className="dashboard-item" sm={24} md={11} lg={7}>
                <BaseList
                    title={t("admin:dashboardHiddenClaims")}
                    apiCall={claimApi.get}
                    filter={{
                        i18n,
                        isHidden: true,
                    }}
                    emptyFallback={<></>}
                    renderItem={(claim) =>
                        claim && (
                            <ClaimCard
                                key={claim._id}
                                personality={claim.personalities[0]}
                                claim={claim}
                            />
                        )
                    }
                    skeleton={<ClaimSkeleton />}
                />
            </Col>

            <Col className="dashboard-item" sm={24} md={11} lg={7}>
                <BaseList
                    title={t("admin:dashboardHiddenReviews")}
                    apiCall={claimReviewApi.get}
                    filter={{ isHidden: true }}
                    emptyFallback={<></>}
                    renderItem={(review) =>
                        review && (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                summarized={true}
                            />
                        )
                    }
                    skeleton={<ClaimSkeleton />}
                />
            </Col>
        </DashboardViewStyle>
    );
};

export default DashboardView;
