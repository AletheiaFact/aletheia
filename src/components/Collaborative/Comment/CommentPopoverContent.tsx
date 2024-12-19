import React from "react";
import Button, { ButtonType } from "../../Button";
import { Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

const CommentPopoverContent = ({ handleDeleteClick }) => {
    const { t } = useTranslation();
    return (
        <Grid className="source-card-popover-content">
            <Button
                buttonType={ButtonType.white}
                style={{
                    gap: 8,
                    border: "none",
                    display: "flex",
                    justifyContent: "start",
                    padding: 0,
                }}
                onClick={handleDeleteClick}
            >
                <DeleteIcon />
                {t("sourceForm:deleteSourceButton")}
            </Button>
        </Grid>
    );
};

export default CommentPopoverContent;
