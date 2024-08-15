import { Col, Tag, Typography } from "antd";
import React from "react";
import styled from "styled-components";
import CardBase from "../CardBase";
import Link from "next/link";
import colors from "../../styles/colors";
import LocalizedDate from "../LocalizedDate";

const CustomTag = styled(Tag)`
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
    const getTags = (verificationRequest) => {
        const tags = [];
        if (verificationRequest.publicationDate) {
            const publicationDate = new Date(
                verificationRequest.publicationDate
            );

            const isValidDate = !isNaN(publicationDate.getTime());

            tags.push(
                <CustomTag
                    color={colors.blueSecondary}
                    key={`${verificationRequest._id}|publicationDate`}
                >
                    <strong>
                        {t(
                            "verificationRequest:verificationRequestTagPublicationDate"
                        )}
                    </strong>{" "}
                    {isValidDate ? (
                        <LocalizedDate date={publicationDate} />
                    ) : (
                        verificationRequest.publicationDate
                    )}
                </CustomTag>
            );
        }
        if (verificationRequest.date) {
            tags.push(
                <CustomTag
                    color={colors.graySecondary}
                    key={`${verificationRequest._id}|date`}
                >
                    <strong>
                        {t("verificationRequest:verificationRequestTagDate")}
                    </strong>{" "}
                    <LocalizedDate date={verificationRequest.date} />
                </CustomTag>
            );
        }
        if (verificationRequest.heardFrom) {
            tags.push(
                <CustomTag
                    color={colors.blueTertiary}
                    key={`${verificationRequest._id}|heardFrom`}
                >
                    <strong>
                        {t(
                            "verificationRequest:verificationRequestTagHeardFrom"
                        )}
                    </strong>{" "}
                    {verificationRequest.heardFrom}
                </CustomTag>
            );
        }
        if (verificationRequest.source) {
            tags.push(
                <CustomTag
                    color={colors.lightBlueMain}
                    key={`${verificationRequest._id}|source`}
                >
                    <strong>
                        {t("verificationRequest:verificationRequestTagSource")}
                    </strong>
                    <Link href={verificationRequest.source.href} passHref>
                        <a>{truncateUrl(verificationRequest.source.href)}</a>
                    </Link>
                </CustomTag>
            );
        }
        return tags;
    };

    return (
        <CardBase style={{ padding: 32, ...style }}>
            <ContentWrapper>
                <Typography.Paragraph
                    style={{
                        marginBottom: 0,
                        color: colors.blackPrimary,
                        margin: 0,
                        lineHeight: 1.6,
                    }}
                    ellipsis={{ rows: 4, expandable }}
                >
                    {verificationRequest.content}
                </Typography.Paragraph>
                <TagContainer>{getTags(verificationRequest)}</TagContainer>
            </ContentWrapper>

            <Col
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
            </Col>
        </CardBase>
    );
};

export default VerificationRequestCard;
