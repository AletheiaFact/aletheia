import AletheiaButton, { ButtonType } from "../Button";
import { List, Typography } from "antd";

import React, { useContext } from "react";
import SourceListItem from "./SourceListItem";
import { SourcesListStyle } from "./SourcesList.style";
import { useTranslation } from "next-i18next";
import { useSelector } from "@xstate/react";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { publishedSelector } from "../../machines/reviewTask/selectors";

const SourcesList = ({
    sources,
    seeMoreHref,
}: {
    sources: any[];
    seeMoreHref: string;
}) => {
    const { t } = useTranslation();
    const { machineService, publishedReview } = useContext(
        ReviewTaskMachineContext
    );
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const sourcesGridColumns = 6;

    return (
        <SourcesListStyle>
            {sources && (
                <List
                    dataSource={
                        isPublished
                            ? sources.slice(0, sourcesGridColumns)
                            : sources
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
                            <SourceListItem
                                key={index}
                                source={source}
                                index={index + 1}
                            />
                        );
                    }}
                />
            )}
            {isPublished && sources?.length > sourcesGridColumns && (
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
