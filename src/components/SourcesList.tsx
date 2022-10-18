import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { Col, List, Skeleton, Typography } from "antd";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React from "react";

import colors from "../styles/colors";
import AletheiaButton, { ButtonType } from "./Button";
import Paragraph from "./Paragraph";

import { SourcesListStyle } from "./SourcesList.style";

const SourcesList = ({
    sources,
    seeMoreHref,
}: {
    sources: string[];
    seeMoreHref: string;
}) => {
    const { t } = useTranslation();

    return (
        <SourcesListStyle>
            {sources && (
                <List
                    itemLayout="horizontal"
                    dataSource={sources.slice(0, 6)}
                    style={{ width: "100%" }}
                    grid={{
                        gutter: 38,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 3,
                        xxl: 3,
                    }}
                    renderItem={(link: any) => {
                        return (
                            <Col className="source">
                                <LinkPreview
                                    url={link}
                                    borderRadius="10px"
                                    backgroundColor={colors.white}
                                    borderColor={colors.blueQuartiary}
                                    imageHeight="156px"
                                    height={244}
                                    secondaryTextColor={colors.grayPrimary}
                                    fallback={
                                        <>
                                            <Skeleton.Image className="source-placeholder-image" />
                                            <Link href={link}>{link}</Link>
                                        </>
                                    }
                                    showPlaceholderIfNoImage
                                    width="100%"
                                    descriptionLength={140}
                                />
                                <Paragraph className="source-footer">
                                    <span>{t("claim:sourceFooter2")}</span>{" "}
                                    <a
                                        href={`mailto:${t(
                                            "common:supportEmail"
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {t("claim:sourceFooterReport")}
                                    </a>
                                </Paragraph>
                            </Col>
                        );
                    }}
                />
            )}
            {sources?.length > 4 && (
                <AletheiaButton type={ButtonType.blue} href={seeMoreHref}>
                    <Typography.Title level={4} className="all-sources-link">
                        {t("claim:seeSourcesButton")}
                    </Typography.Title>
                </AletheiaButton>
            )}
        </SourcesListStyle>
    );
};

export default SourcesList;
