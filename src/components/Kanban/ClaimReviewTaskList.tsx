import React, { useEffect, useState } from "react";
import claimReviewTaskApi from "../../api/ClaimReviewTaskApi";
import KanbanCard from "./KanbanCard";

const ClaimReviewTaskList = ({ value }) => {
    const [ reviewTasks, setReviewTasks ] = useState(null)

    useEffect(() => {
        claimReviewTaskApi.getClaimReviewTasks(value).then((claimReviewTasks) => {
            setReviewTasks(claimReviewTasks)
        })
    }, []);

    return (
        <>
            {reviewTasks && reviewTasks[0]?.reviews.map((review) => {
                return (
                    <KanbanCard
                        reviewTask={review}
                    />
                )
            })}
        </>
    );
}
export default ClaimReviewTaskList;
