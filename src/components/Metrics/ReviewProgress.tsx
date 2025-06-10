import React from "react";
import {
    Grid,
    LinearProgress,
    CircularProgress,
    linearProgressClasses,
    circularProgressClasses
} from "@mui/material";
import styled from "styled-components";
import ReviewColors from "../../constants/reviewColors";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";

const ReviewProgress = ({ reviews, statsProps }) => {
    const { t } = useTranslation();
    
    return reviews.map((review) => {
        const BorderLinearProgress = styled(LinearProgress)(() => ({
            [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 10,
                backgroundColor: ReviewColors[review._id] || colors.black,
            },
        }));

        const BorderCircularProgress = styled(CircularProgress)(() => ({
            [`& .${circularProgressClasses.circle}`]: {
                color: ReviewColors[review._id] || colors.black,
            },
        }));

        return (
            <div
                style={
                    statsProps.type === "circle"
                        ? {
                            display: "flex",
                            flexDirection: "column-reverse",
                            alignItems: "center",
                            paddingRight: "10px",
                        }
                        : {}
                }
                key={review._id}
            >
                <span
                    style={{
                        color: ReviewColors[review._id] || colors.black,
                        fontWeight: "700",
                        textTransform: "uppercase",
                        textAlign: "center",
                        fontSize: "10px",
                        marginTop: "5px",
                    }}
                >
                    {statsProps.countInTitle && `${review.count} `}
                    {t(`claimReviewForm:${review._id}`)}
                </span>
                {statsProps.type === "circle" ?
                    <Grid container position="relative" display="inline-flex" justifyContent="center"
                        alignItems="center">
                        <CircularProgress
                            variant="determinate"
                            value={100}
                            size={statsProps.size}
                            thickness={8}
                            sx={{ color: colors.neutralTertiary, position: "absolute" }}
                        />
                        <BorderCircularProgress
                            variant="determinate"
                            value={review.percentage}
                            size={statsProps.size}
                            thickness={8}
                        />
                        <p
                            style={{
                                fontSize: statsProps.size === 30 ? "10px" : "14px",
                                position: "absolute",
                            }}
                        >
                            {review.count}
                        </p>
                    </Grid>
                    :
                    <Grid container alignItems="center">
                        <Grid item xs={11}>
                            <BorderLinearProgress
                                variant="determinate"
                                value={review.percentage}
                                sx={{ height: 18, borderRadius: 10 }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <p
                                style={{ fontSize: "12px", margin: 0, padding: "0px 10px" }}
                            >
                                {review.percentage}%
                            </p>
                        </Grid>
                    </Grid>
                }
            </div >
        );
    });
};

export default ReviewProgress;
