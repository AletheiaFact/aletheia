import React from "react";
import BaseList from "../List/BaseList";
import personalitiesApi from "../../api/personality";
import { useTranslation } from "next-i18next";
import PersonalityCard from "../Personality/PersonalityCard";
import PersonalitySkeleton from "../Skeleton/PersonalitySkeleton";
import { Grid } from "@mui/material";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";
import claimApi from "../../api/claim";
import ClaimCard from "../Claim/ClaimCard";
import claimReviewApi from "../../api/claimReviewApi";
import DashboardViewStyle from "./DashboardView.style";
import ReviewCard from "../ClaimReview/ReviewCard";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const DashboardView = () => {
    const { t, i18n } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    return (
        <DashboardViewStyle container>
            <Grid item className="dashboard-item" sm={12} md={5} lg={3.5}>
                <BaseList
                    title={t("admin:dashboardHiddenPersonalities")}
                    apiCall={personalitiesApi.getPersonalities}
                    filter={{
                        i18n,
                        isHidden: true,
                    }}
                    showDividers={false}
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
            </Grid>

            <Grid item className="dashboard-item" sm={12} md={5} lg={3.5}>
                <BaseList
                    title={t("admin:dashboardHiddenClaims")}
                    apiCall={claimApi.get}
                    filter={{
                        i18n,
                        isHidden: true,
                        nameSpace,
                    }}
                    showDividers={false}
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
            </Grid>

            <Grid item className="dashboard-item" sm={12} md={5} lg={3.5}>
                <BaseList
                    title={t("admin:dashboardHiddenReviews")}
                    apiCall={claimReviewApi.get}
                    filter={{
                        isHidden: true,
                        nameSpace,
                    }}
                    showDividers={false}
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
            </Grid>
        </DashboardViewStyle>
    );
};

export default DashboardView;
