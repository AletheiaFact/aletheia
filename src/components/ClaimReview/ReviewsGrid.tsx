import React from "react";
import GridList from "../GridList";
import ReviewCard from "./ReviewCard";

const ReviewsGrid = ({ reviews, title }) => {
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
