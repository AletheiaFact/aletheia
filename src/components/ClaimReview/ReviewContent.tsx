import React from "react";
import ImageClaim from "../ImageClaim";
import ReviewContentStyled from "./ReviewContent.style";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

interface ReviewContentProps {
    title: string;
    content: string;
    isImage: boolean;
    contentPath?: string | null;
    linkText?: string | null;
    style?: React.CSSProperties;
    ellipsis?: boolean;
}

const ReviewContent: React.FC<ReviewContentProps> = ({
    title,
    content,
    isImage,
    contentPath = null,
    linkText = null,
    style = {},
    ellipsis = false,
}) => {
    if (isImage) {
        return (
            <ReviewContentStyled>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            fontWeight: 600,
                            fontSize: "1.125rem",
                            lineHeight: 1.5,
                            color: "text.primary",
                            marginBottom: 0,
                        }}
                    >
                        <cite>{title}</cite>
                    </Typography>

                    <ImageClaim src={content} title={title} />

                    {contentPath && linkText && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                            }}
                        >
                            <a
                                href={contentPath}
                                data-cy="testSeeFullSpeech"
                                style={{
                                    textDecorationLine: "underline",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    marginLeft: 0,
                                }}
                            >
                                {linkText}
                            </a>
                        </Box>
                    )}
                </Box>
            </ReviewContentStyled>
        );
    }

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
