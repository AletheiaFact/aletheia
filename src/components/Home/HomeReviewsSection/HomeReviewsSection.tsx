import React from "react";
import { Box } from "@mui/material";
import { useAtom } from "jotai";
import { Review } from "../../../types/Review";
import HomeReviewsSectionStyle from "./HomeReviewsSection.style";
import { currentNameSpace } from "../../../atoms/namespace";
import { NameSpaceEnum } from "../../../types/Namespace";
import ReviewCard from "../../ClaimReview/ReviewCard";
import GridList from "../../GridList";
import { useTranslations } from "next-intl";

interface HomeReviewsSectionProps {
    reviews: Review[];
}

const HomeReviewsSection = ({ reviews }: HomeReviewsSectionProps) => {
    const tHome = useTranslations("home");
    const [nameSpace] = useAtom(currentNameSpace);

    if (!Array.isArray(reviews) || reviews.length === 0) {
        return null;
    }

    const seeAllHref =
        nameSpace === NameSpaceEnum.Main ? "/claim" : `/${nameSpace}/claim`;

    return (
        <HomeReviewsSectionStyle container>
            <Box className="reviews-inner">
                <GridList
                    title={tHome("latestReviewsTitle")}
                    subtitle={tHome("latestReviewsSubtitle")}
                    dataSource={reviews}
                    href={seeAllHref}
                    seeMoreButtonLabel={tHome("latestReviewsSeeAll")}
                    seeMoreButtonPosition="top"
                    itemSize={{ xs: 12, md: 6, lg: 4 }}
                    getKey={(review) => review.id}
                    renderItem={(review) => <ReviewCard review={review} />}
                />
            </Box>
        </HomeReviewsSectionStyle>
    );
};

export default HomeReviewsSection;
