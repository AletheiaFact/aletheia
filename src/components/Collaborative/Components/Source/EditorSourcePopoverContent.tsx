import React from "react";
import AletheiaButton, { ButtonType } from "../../../AletheiaButton";
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
            <AletheiaButton
                type={ButtonType.white}
                startIcon={<ArchiveIcon />}
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
                Internet archive
            </AletheiaButton>
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
            <AletheiaButton
                type={ButtonType.white}
                startIcon={<DeleteIcon />}
                style={{
                    textDecoration: "underline",
                    gap: 8,
                    border: "none",
                    display: "flex",
                    justifyContent: "start",
                    marginBottom: 10,
                    width: "100%"
                }}
                onClick={handleDeleteClick}
            >
                {t("sourceForm:deleteSourceButton")}
            </AletheiaButton>
        </Grid>
    );
};

export default EditorSourcePopoverContent;
