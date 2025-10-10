import { Grid, Chip, Typography, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CardBase from "../CardBase";
import Link from "next/link";
import colors from "../../styles/colors";
import LocalizedDate from "../LocalizedDate";

const CustomTag = styled(Chip)`
    border-radius: 4px;
    font-size: 10px;
    margin-bottom: 4px;
    padding: 2px 4px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    strong {
        margin-right: 2px;
    }

    a {
        color: inherit;
        text-decoration: none;
    }
`;

const TagContainer = styled.div`
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    word-wrap: break-word;
    overflow: hidden;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const truncateUrl = (url) => {
    try {
        const { hostname, pathname } = new URL(url);
        const maxLength = 30;
        const shortPath =
            pathname.length > maxLength
                ? `${pathname.substring(0, maxLength)}...`
                : pathname;
        return `${hostname}${shortPath}`;
    } catch (e) {
        return url;
    }
};

const VerificationRequestCard = ({
    verificationRequest,
    actions = [],
    expandable = true,
    t,
    style = {},
}) => {
    const [visible, setVisible] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);

    const handleToggle = () => {
        setVisible(true);
    };

    useEffect(() => {
        if (textRef.current) {
            const isOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
            setIsOverflowing(isOverflow);
        }
    }, [verificationRequest.content]);

    const getTags = (verificationRequest) => {
        const tags = [];
        if (verificationRequest.publicationDate) {
            const publicationDate = new Date(
                verificationRequest.publicationDate
            );

            const isValidDate = !isNaN(publicationDate.getTime());

            tags.push(
                <CustomTag
                    style={{ backgroundColor: colors.secondary, color: colors.white }}
                    key={`${verificationRequest._id}|publicationDate`}
                    label={
                        <div>
                            <strong>
                                {t(
                                    "verificationRequest:verificationRequestTagPublicationDate"
                                )}
                                :
                            </strong>{" "}
                            {isValidDate ? (
                                <LocalizedDate date={publicationDate} />
                            ) : (
                                verificationRequest.publicationDate
                            )}
                        </div>
                    }
                />
            );
        }
        if (verificationRequest.date) {
            tags.push(
                <CustomTag
                    style={{ backgroundColor: colors.neutralSecondary, color: colors.white }}
                    key={`${verificationRequest._id}|date`}
                    label={
                        <div>
                            <strong>
                                {t("verificationRequest:verificationRequestTagDate")}:
                            </strong>{" "}
                            <LocalizedDate date={verificationRequest.date} />
                        </div>
                    }
                />
            );
        }
        if (verificationRequest.heardFrom) {
            tags.push(
                <CustomTag
                    style={{ backgroundColor: colors.tertiary, color: colors.white }}
                    key={`${verificationRequest._id}|heardFrom`}
                    label={
                        <div>
                            <strong>
                                {t(
                                    "verificationRequest:verificationRequestTagHeardFrom"
                                )}
                                :
                            </strong>{" "}
                            {verificationRequest.heardFrom}
                        </div>
                    }
                />
            );
        }
        if (verificationRequest.source && verificationRequest.source.length > 0) {
            for (const [index, source] of verificationRequest.source.entries()) {
                if (source?.href) {
                    tags.push(
                        <CustomTag
                            style={{ backgroundColor: colors.lightPrimary, color: colors.white }}
                            key={`${verificationRequest._id}|source|${index}`}
                            label={
                                <div>
                                    <strong>
                                        {t("verificationRequest:verificationRequestTagSource")}:
                                    </strong>
                                    <Link href={source.href} passHref>
                                        {truncateUrl(source.href)}
                                    </Link>
                                </div>
                            }
                        />
                    );
                }
            }
        }
        return tags;
    };

    return (
        <CardBase style={{ padding: 32, ...style }}>
            <ContentWrapper>
                <Typography
                    ref={textRef}
                    variant="body1"
                    style={{
                        color: colors.black,
                        margin: 0,
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: visible ? "none" : 3,
                    }}

                >
                    {verificationRequest.content}
                </Typography>
                {expandable && !visible && isOverflowing && (
                    <Button
                        variant="text"
                        style={{ marginLeft: "auto", color: colors.lightPrimary, textDecoration: 'underline', padding: 0 }}
                        onClick={handleToggle}
                    >
                        {t("verificationRequest:showText")}
                    </Button>
                )}
                <TagContainer>{getTags(verificationRequest)}</TagContainer>
            </ContentWrapper>

            <Grid item
                style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent:
                        actions.length > 1 ? "space-around" : "flex-end",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "100%",
                }}
            >
                {actions ? actions.map((action) => action) : <></>}
            </Grid>
        </CardBase>
    );
};

export default VerificationRequestCard;
