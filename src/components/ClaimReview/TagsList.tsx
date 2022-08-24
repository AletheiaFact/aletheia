import { Col, Tag } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";

interface TagsListProps {
    tags: string[];
    editable?: boolean;
    handleClose?: (string) => void;
}

const TagsList = ({ tags, editable = false, handleClose }: TagsListProps) => {
    const { t } = useTranslation();

    return (
        <Col>
            {!tags.length && <span>{t("topics:noTopics")}</span>}

            {tags &&
                tags.map((tag) => (
                    <Tag
                        key={tag}
                        color={colors.bluePrimary}
                        closable={editable}
                        onClose={() => handleClose(tag)}
                        style={{
                            borderRadius: 32,
                            padding: "4px 10px 2px",
                        }}
                    >
                        {tag.toUpperCase()}
                    </Tag>
                ))}
        </Col>
    );
};

export default TagsList;
