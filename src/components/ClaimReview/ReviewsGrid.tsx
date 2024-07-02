import React from "react";
import GridList from "../GridList";
import ReviewCard from "./ReviewCard";

const ReviewsGrid = ({ reviews, title }) => {
    return (
        <GridList
            title={title}
            dataSource={reviews}
            loggedInMaxColumns={2}
            disableSeeMoreButton={true}
            gridLayout={{
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
            }}
            renderItem={(review) => <ReviewCard review={review} />}
        />
    );
};

export default ReviewsGrid;
