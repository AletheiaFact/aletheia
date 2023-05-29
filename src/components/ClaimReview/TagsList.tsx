import { Col, Tag } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import router from "next/router";

interface TagsListProps {
    tags: string[];
    editable?: boolean;
    handleClose?: (string) => void;
}

const TagsList = ({ tags, editable = false, handleClose }: TagsListProps) => {
    const { t } = useTranslation();

    const handleTagClick = (tag) => {
        router
            .push({
                pathname: "/search",
                query: { filter: tag },
            })
            .catch((error) => console.log(`Error: ${error.message}`));
    };

    return (
        <Col>
            {!tags.length && <span>{t("topics:noTopics")}</span>}

            {tags &&
                tags.map((tag) => (
                    <Tag
                        key={tag}
                        color={colors.blueSecondary}
                        closable={editable}
                        onClose={() => handleClose(tag)}
                        style={{
                            borderRadius: 32,
                            padding: "4px 10px 2px",
                            marginTop: 4,
                            marginBottom: 4,
                            cursor: "pointer",
                        }}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag.toUpperCase()}
                    </Tag>
                ))}
        </Col>
    );
};

export default TagsList;
