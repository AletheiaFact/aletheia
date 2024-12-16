import AletheiaButton, { ButtonType } from "../Button";
import { List, Typography } from "antd";

import React from "react";
import ClaimSourceListItem from "./ClaimSourceListItem";
import { ClaimSourceListStyle } from "./ClaimSourceList.style";
import { useTranslation } from "next-i18next";

const ClaimSourceList = ({
    sources,
    seeMoreHref,
    showAllSources = false,
}: {
    sources: any[];
    seeMoreHref: string;
    showAllSources?: boolean;
}) => {
    const { t } = useTranslation();
    const sourcesGridColumns = 6;

    return (
        <ClaimSourceListStyle>
            {sources && (
                <List
                    dataSource={
                        showAllSources
                            ? sources
                            : sources.slice(0, sourcesGridColumns)
                    }
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
                    renderItem={(source, index) => {
                        return (
                            <ClaimSourceListItem
                                key={index}
                                source={source}
                                index={index + 1}
                            />
                        );
                    }}
                />
            )}
            {!showAllSources && sources?.length > sourcesGridColumns && (
                <AletheiaButton
                    buttonType={ButtonType.blue}
                    href={seeMoreHref}
                    className="all-sources-link-button"
                >
                    <Typography.Title level={4} className="all-sources-link">
                        {t("claim:seeSourcesButton")}
                    </Typography.Title>
                </AletheiaButton>
            )}
        </ClaimSourceListStyle>
    );
};

export default ClaimSourceList;
