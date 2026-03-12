import React from "react";
import GridList from "../GridList";
import ReviewCard from "./ReviewCard";
import { Review } from "../../types/Review";

type ReviewsGridProps = {
    reviews: Review[];
    title: React.ReactNode;
    hasDivider?: boolean
}

const ReviewsGrid = ({ reviews, title, hasDivider }: ReviewsGridProps) => {
    return (
        <GridList
            title={title}
            dataSource={reviews}
            hasDivider={hasDivider}
            loggedInMaxColumns={12}
            disableSeeMoreButton={true}
            renderItem={(review) => <ReviewCard review={review} />}
        />
    );
};

export default ReviewsGrid;
