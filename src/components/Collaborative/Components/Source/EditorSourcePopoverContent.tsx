import React from "react";
import Button, { ButtonType } from "../../../Button";
import { Grid } from "@mui/material";
import InfoTooltip from "../../../Claim/InfoTooltip";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

const EditorSourcePopoverContent = ({
    isArchive,
    handleArchiveClick,
    handleDeleteClick,
}) => {
    const { t } = useTranslation();

    const ButtonTooltip = (
        <span>
            <Button
                type={ButtonType.white}
                onClick={handleArchiveClick}
                style={{
                    gap: 8,
                    border: "none",
                    display: "flex",
                    justifyContent: "start",
                    textDecoration: "underline",
                    marginTop: 10,
                }}
            >
                <ArchiveIcon />
                Internet archive
            </Button>
        </span>
    );

    return (
        <Grid item className="source-card-popover-content">
            {!isArchive && (
                <InfoTooltip
                    useCustomStyle={false}
                    children={ButtonTooltip}
                    content={t("sourceForm:intertArchiveTooltip")}
                />
            )}
            <Button
                type={ButtonType.white}
                style={{
                    textDecoration: "underline",
                    gap: 8,
                    border: "none",
                    display: "flex",
                    justifyContent: "start",
                    marginBottom: 10,
                }}
                onClick={handleDeleteClick}
            >
                <DeleteIcon />
                {t("sourceForm:deleteSourceButton")}
            </Button>
        </Grid>
    );
};

export default EditorSourcePopoverContent;
