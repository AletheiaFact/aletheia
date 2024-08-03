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
    content,
    actions = [],
    expandable = true,
    t,
    style = {},
}) => {
    const getTags = (content) => {
        const tags = [];
        if (content.publicationDate) {
            tags.push(
                <CustomTag
                    color={colors.blueSecondary}
                    key={`${content._id}|publicationDate`}
                >
                    <strong>
                        {t(
                            "verificationRequest:verificationRequestTagPublicationDate"
                        )}
                    </strong>{" "}
                    {content.publicationDate}
                </CustomTag>
            );
        }
        if (content.date) {
            tags.push(
                <CustomTag
                    color={colors.graySecondary}
                    key={`${content._id}|date`}
                >
                    <strong>
                        {t("verificationRequest:verificationRequestTagDate")}
                    </strong>{" "}
                    <LocalizedDate date={content.date} />
                </CustomTag>
            );
        }
        if (content.heardFrom) {
            tags.push(
                <CustomTag
                    color={colors.blueTertiary}
                    key={`${content._id}|heardFrom`}
                >
                    <strong>
                        {t(
                            "verificationRequest:verificationRequestTagHeardFrom"
                        )}
                    </strong>{" "}
                    {content.heardFrom}
                </CustomTag>
            );
        }
        if (content.source) {
            tags.push(
                <CustomTag
                    color={colors.lightBlueMain}
                    key={`${content._id}|source`}
                >
                    <strong>
                        {t("verificationRequest:verificationRequestTagSource")}
                    </strong>
                    <Link href={content.source.href} passHref>
                        <a>{truncateUrl(content.source.href)}</a>
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
                    {content}
                </Typography.Paragraph>
                <TagContainer>{getTags(content)}</TagContainer>
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
