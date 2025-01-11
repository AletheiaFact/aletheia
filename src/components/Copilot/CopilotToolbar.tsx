import React from "react";
import ViewSidebarRoundedIcon from "@mui/icons-material/ViewSidebarRounded";
import colors from "../../styles/colors";
import styled from "styled-components";
import { Button, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";
import RestoreIcon from "@mui/icons-material/Restore";
import { useTranslation } from "next-i18next";

const CopilotToolbarStyled = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-bottom: 8px;

    .toolbar-item,
    .toolbar-item:active,
    .toolbar-item:focus {
        background-color: transparent;
        color: ${colors.primary};
    }

    .toolbar-item:hover {
        border: none;
        border-color: ${colors.primary};
        color: ${colors.primary};
        outline: none;
    }
`;

const CopilotToolbar = ({ handleClearConversation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const handleCloseSidebarClick = () => {
        dispatch(actions.closeCopilotDrawer());
    };

    return (
        <CopilotToolbarStyled>
            <Tooltip
                placement="top"
                title={t("copilotChatBot:copilotClearHistoryTooltip")}
            >
                <Button
                    className="toolbar-item"
                    onClick={handleClearConversation}
                    style={{ outline: "none", border: "none" }}
                >
                    <RestoreIcon style={{ fontSize: "27px" }} />
                </Button>
            </Tooltip>

            <Tooltip
                placement="top"
                title={t("copilotChatBot:copilotCloseSidebarTooltip")}
            >
                <Button
                    className="toolbar-item"
                    onClick={handleCloseSidebarClick}
                    style={{ outline: "none", border: "none" }}
                >
                    <ViewSidebarRoundedIcon style={{ fontSize: "27px" }} />
                </Button>
            </Tooltip>
        </CopilotToolbarStyled>
    );
};

export default CopilotToolbar;
