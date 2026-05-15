import React from "react";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import { Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

const CommentPopoverContent = ({ handleDeleteClick }) => {
    const { t } = useTranslation();

    return (
        <Grid className="source-card-popover-content">
            <AletheiaButton
                type={ButtonType.white}
                style={{ margin: "5px 0px" }}
                onClick={handleDeleteClick}
            >
                <DeleteIcon />
                {t("sourceForm:deleteSourceButton")}
            </AletheiaButton>
        </Grid>
    );
};

export default CommentPopoverContent;
