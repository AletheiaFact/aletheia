import React from "react";
import Button, { ButtonType } from "../../../Button";
import { Col, Tooltip } from "antd";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

const EditorSourcePopoverContent = ({
    isArchive,
    handleArchiveClick,
    handleDeleteClick,
}) => {
    const { t } = useTranslation();
    return (
        <Col className="source-card-popover-content">
            {!isArchive && (
                <Tooltip
                    placement="top"
                    title={t("sourceForm:intertArchiveTooltip")}
                >
                    <Button
                        buttonType={ButtonType.white}
                        onClick={handleArchiveClick}
                        style={{
                            textDecoration: "underline",
                            gap: 8,
                            border: "none",
                            display: "flex",
                            justifyContent: "start",
                            padding: 0,
                        }}
                    >
                        <ArchiveIcon />
                        Internet archive
                    </Button>
                </Tooltip>
            )}
            <Button
                buttonType={ButtonType.white}
                style={{
                    textDecoration: "underline",
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
        </Col>
    );
};

export default EditorSourcePopoverContent;
