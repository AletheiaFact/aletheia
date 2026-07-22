import React from "react";
import AletheiaButton, { ButtonType } from "../../../AletheiaButton";
import { Grid } from "@mui/material";
import InfoTooltip from "../../../Claim/InfoTooltip";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";

const EditorSourcePopoverContent = ({
    isArchive,
    handleArchiveClick,
    handleDeleteClick,
}) => {
    const tSourceForm = useTranslations("sourceForm");

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
                    content={tSourceForm("intertArchiveTooltip")}
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
                {tSourceForm("deleteSourceButton")}
            </AletheiaButton>
        </Grid>
    );
};

export default EditorSourcePopoverContent;
