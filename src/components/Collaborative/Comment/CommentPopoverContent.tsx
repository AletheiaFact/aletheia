import React from "react";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import { Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";

interface CommentPopoverContentProps {
    handleDeleteClick: () => void;
}

const CommentPopoverContent = ({
    handleDeleteClick,
}: CommentPopoverContentProps) => {
    const tSourceForm = useTranslations("sourceForm");

    return (
        <Grid className="source-card-popover-content">
            <AletheiaButton
                type={ButtonType.white}
                style={{ margin: "5px 0px" }}
                onClick={handleDeleteClick}
            >
                <DeleteIcon />
                {tSourceForm("deleteSourceButton")}
            </AletheiaButton>
        </Grid>
    );
};

export default CommentPopoverContent;
