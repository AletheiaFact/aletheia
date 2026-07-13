import React from "react";
import BaseList from "../List/BaseList";
import personalitiesApi from "../../api/personality";
import PersonalityCard from "../Personality/PersonalityCard";
import PersonalitySkeleton from "../Skeleton/PersonalitySkeleton";
import { Grid } from "@mui/material";
import ClaimSkeleton from "../Skeleton/ClaimSkeleton";
import claimApi from "../../api/claimApi";
import ClaimCard from "../Claim/ClaimCard";
import claimReviewApi from "../../api/claimReviewApi";
import DashboardViewStyle from "./DashboardView.style";
import ReviewCard from "../ClaimReview/ReviewCard";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { useLocale, useTranslations } from "next-intl";

const DashboardView = () => {
    const locale = useLocale();
    const tAdmin = useTranslations("admin");
    const [nameSpace] = useAtom(currentNameSpace);

    return (
        <DashboardViewStyle container>
            <Grid item className="dashboard-item" sm={12} md={5} lg={3.5}>
                <BaseList
                    title={tAdmin("dashboardHiddenPersonalities")}
                    apiCall={personalitiesApi.getPersonalities}
                    filter={{
                        locale,
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
                    title={tAdmin("dashboardHiddenClaims")}
                    apiCall={claimApi.get}
                    filter={{
                        locale,
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
                    title={tAdmin("dashboardHiddenReviews")}
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
