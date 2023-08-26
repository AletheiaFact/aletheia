import AletheiaButton, { ButtonType } from "../Button";
import { List, Typography } from "antd";

import React from "react";
import SourceListItem from "./SourceListItem";
import { SourcesListStyle } from "./SourcesList.style";
import { useTranslation } from "next-i18next";

const SourcesList = ({
    sources,
    seeMoreHref,
}: {
    sources: any[];
    seeMoreHref: string;
}) => {
    const { t } = useTranslation();
    const sourcesGridColumns = 6;

    return (
        <SourcesListStyle>
            {sources && (
                <List
                    dataSource={sources.slice(0, sourcesGridColumns)}
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
                            <SourceListItem
                                key={index}
                                source={source}
                                index={index + 1}
                            />
                        );
                    }}
                />
            )}
            {sources?.length > sourcesGridColumns && (
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
