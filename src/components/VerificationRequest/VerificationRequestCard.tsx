import { Grid, Chip, Typography } from "@mui/material";
import React from "react";
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
    t,
    style = {},
}) => {
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
        if (verificationRequest.source) {
            tags.push(
                <CustomTag
                    style={{ backgroundColor: colors.lightPrimary, color: colors.white }}
                    key={`${verificationRequest._id}|source`}
                    label={
                        <div>
                            <strong>
                                {t("verificationRequest:verificationRequestTagSource")}:
                            </strong>
                            <Link href={verificationRequest.source.href} passHref>
                                <a>{truncateUrl(verificationRequest.source.href)}</a>
                            </Link>
                        </div>
                    }
                />
            );
        }
        return tags;
    };

    return (
        <CardBase style={{ padding: 32, ...style }}>
            <ContentWrapper>
                <Typography
                    variant="body1"
                    style={{
                        color: colors.black,
                        margin: 0,
                        lineHeight: 1.6,
                    }}
                >
                    {verificationRequest.content}
                </Typography>
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
