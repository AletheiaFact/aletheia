import React, { useState } from "react";
import { ArrowDownwardOutlined, ArrowUpwardOutlined } from "@mui/icons-material";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import ReviewProgress from "./ReviewProgress";
import AletheiaTitle from "../AletheiaTitle";
import { useTranslations } from "next-intl";

const ReviewStats = (props) => {
    const tPersonality = useTranslations("personality");
    const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
    const { reviews } = props?.stats || {};
    const firstThreeReviews = reviews?.slice(0, 3);
    const remainingReviews = reviews?.slice(3);

    const reviewStats = props.type === "line" ? firstThreeReviews : reviews;
    return (
        <>
            {reviews && (
                <ReviewProgress reviews={reviewStats} statsProps={props} />
            )}
            {reviews && showAllReviews && (
                <ReviewProgress reviews={remainingReviews} statsProps={props} />
            )}
            {reviews && reviews?.length > 3 && props.type === "line" && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <AletheiaButton
                        endIcon={
                            showAllReviews ? (
                                <ArrowUpwardOutlined />
                            ) : (
                                <ArrowDownwardOutlined />
                            )
                        }
                        style={{ marginTop: "24px" }}
                        type={ButtonType.primary}
                        onClick={() => setShowAllReviews(!showAllReviews)}
                    >
                        <AletheiaTitle variant="h4">
                            {tPersonality(
                                showAllReviews
                                    ? `seeLessMetricsOverviews`
                                    : `seeAllMetricsOverviews`
                            )}
                        </AletheiaTitle>
                    </AletheiaButton>
                </div>
            )}
        </>
    );
};

export default ReviewStats;
