import React, { useEffect, useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import CardBase from "../CardBase";
import ClaimReviewApi from "../../api/claimReviewApi";
import ReviewCarouselSkeleton from "../Skeleton/ReviewCarouselSkeleton";
import ReviewCardComment from "./ReviewCardComment";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const ReviewsCarousel = () => {
    const [currIndex, setCurrIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [reviewsList, setReviewsList] = useState([]);
    const [nameSpace] = useAtom(currentNameSpace);

    useEffect(() => {
        ClaimReviewApi.get({
            page: 0,
            order: "desc",
            pageSize: 5,
            nameSpace,
        }).then(({ data }) => {
            setReviewsList(data);
            setLoading(false);
        });
    }, [nameSpace]);

    const currentReview = reviewsList[currIndex];

    const nextCard = () => {
        if (currIndex < reviewsList.length - 1) setCurrIndex(currIndex + 1);
        else setCurrIndex(0);
    };

    const previousCard = () => {
        if (currIndex > 0) setCurrIndex(currIndex - 1);
        else setCurrIndex(reviewsList.length - 1);
    };

    if (loading) {
        return <ReviewCarouselSkeleton />;
    }

    return (
        <CardBase style={{ width: "fit-content" }}>
            {reviewsList.length > 0 ? (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Button type="text" onClick={previousCard}>
                        <LeftOutlined />
                    </Button>

                    <ReviewCardComment review={currentReview} />

                    <Button type="text" onClick={nextCard}>
                        <RightOutlined />
                    </Button>
                </div>
            ) : (
                <></>
            )}
        </CardBase>
    );
};

export default ReviewsCarousel;
