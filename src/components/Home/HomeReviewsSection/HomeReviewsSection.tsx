import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { ArrowForwardOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { Review } from "../../../types/Review";
import HomeReviewsSectionStyle from "./HomeReviewsSection.style";
import colors from "../../../styles/colors";
import { currentNameSpace } from "../../../atoms/namespace";
import { NameSpaceEnum } from "../../../types/Namespace";
import ReviewCard from "../../ClaimReview/ReviewCard";

interface HomeReviewsSectionProps {
    reviews: Review[];
}

const HomeReviewsSection = ({ reviews }: HomeReviewsSectionProps) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    if (!Array.isArray(reviews) || reviews.length === 0) {
        return null;
    }

    const seeAllHref =
        nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}/claim` : "/claim";

    return (
        <HomeReviewsSectionStyle container>
            <Box className="reviews-inner">
                <Box className="reviews-header">
                    <Box className="reviews-header-text">
                        <Box className="reviews-header-title">
                            <Typography variant="h2">
                                {t("home:latestReviewsTitle")}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            className="reviews-header-subtitle"
                        >
                            {t("home:latestReviewsSubtitle")}
                        </Typography>
                    </Box>
                    <Button
                        href={seeAllHref}
                        variant="outlined"
                        endIcon={<ArrowForwardOutlined fontSize="small" />}
                        className="reviews-see-all"
                        sx={{
                            borderColor: colors.primary,
                            color: colors.primary,
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: 14,
                            padding: "8px 18px",
                            borderRadius: "6px",
                            background: colors.white,
                            "&:hover": {
                                borderColor: colors.primary,
                                background: colors.lightNeutral,
                            },
                        }}
                    >
                        {t("home:latestReviewsSeeAll")}
                    </Button>
                </Box>
                <Box className="reviews-grid">
                    {reviews.map((review) => (
                        <ReviewCard review={review} />
                    ))}
                </Box>
            </Box>
        </HomeReviewsSectionStyle>
    );
};

export default HomeReviewsSection;
