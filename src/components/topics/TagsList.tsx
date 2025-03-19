import { Chip, Grid } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import router from "next/router";
interface TagsListProps {
    tags: any[];
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
        <Grid item padding={1}>
            {tags.length <= 0 && <span>{t("topics:noTopics")}</span>}

            {tags &&
                tags.map((tag) => (
                    <Chip
                        label={(tag?.label || tag).toUpperCase()}
                        key={tag?.value || tag}
                        onClick={() => handleTagClick(tag?.label || tag)}
                        onDelete={editable ? () => handleClose(tag?.value || tag) : undefined}
                        deleteIcon={<CloseOutlined style={{fontSize: 15, color: colors.white}}/>}
                        style={{
                            backgroundColor: colors.secondary,
                            color: colors.white,
                            borderRadius: 32,
                            padding: "4px 10px 2px",
                            marginTop: 4,
                            marginBottom: 4,
                            cursor: "pointer",
                        }}
                    />
                ))}
        </Grid>
    );
};

export default TagsList;
