import { Col, List, Typography } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";

import AletheiaButton, { ButtonType } from "./Button";

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
            <Typography.Title level={4}>
                {t("claim:sourceSectionTitle")}
            </Typography.Title>
            {sources && (
                <List
                    dataSource={sources.slice(0, 6)}
                    style={{ width: "100%" }}
                    grid={{
                        gutter: 38,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 3,
                        xxl: 3,
                    }}
                    renderItem={(link, index) => {
                        return (
                            <Col className="source">
                                <List.Item key={link}>
                                    {index + 1}.{" "}
                                    <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link}
                                    </a>
                                </List.Item>
                            </Col>
                        );
                    }}
                />
            )}
            {sources?.length > 6 && (
                <AletheiaButton
                    type={ButtonType.blue}
                    href={seeMoreHref}
                    className="all-sources-link-button"
                >
                    <Typography.Title level={4} className="all-sources-link">
                        {t("claim:seeSourcesButton")}
                    </Typography.Title>
                </AletheiaButton>
            )}
        </SourcesListStyle>
    );
};

export default SourcesList;
