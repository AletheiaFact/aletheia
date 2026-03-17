import React from "react";
import GridList from "../GridList";
import ReviewCard from "./ReviewCard";
import { Review } from "../../types/Review";

type ReviewsGridProps = {
    reviews: Review[];
    title: React.ReactNode;
}

const ReviewsGrid = ({ reviews, title, }: ReviewsGridProps) => {
    return (
        <GridList
            title={title}
            dataSource={reviews}
            loggedInMaxColumns={12}
            disableSeeMoreButton={true}
            renderItem={(review) => <ReviewCard review={review} />}
        />
    );
};

export default ReviewsGrid;
