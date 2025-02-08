import React from "react";
import ImageClaim from "../ImageClaim";
import ReviewContentStyled from "./ReviewContent.style";
import Typography from "@mui/material/Typography";

const ReviewContent = ({
    title,
    content,
    isImage,
    contentPath = null,
    linkText = null,
    style = {},
    ellipsis = false,
}) => {
    return (
        <ReviewContentStyled>
            <Typography
                variant="body1"
                style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: ellipsis ? 4 : "none",
                    marginBottom: 0,
                    ...style,
                  }}
            >
                <cite>{title}</cite>
                {isImage && <ImageClaim src={content} title={title} />}
                {!ellipsis && contentPath && linkText && (
                    <a href={contentPath} data-cy={"testSeeFullSpeech"}>
                        {linkText}
                    </a>
                )}
            </Typography>
            {ellipsis && contentPath && linkText && (
                <a
                    href={contentPath}
                    data-cy={"testSeeFullSpeech"}
                    style={{
                        marginLeft: 0,
                        textDecorationLine: "underline",
                        fontSize: 14,
                    }}
                >
                    {linkText}
                </a>
            )}
        </ReviewContentStyled>
    );
};

export default ReviewContent;
