import { Grid } from "@mui/material";
import colors from "../../styles/colors";
import styled from "styled-components";

const CopilotConversationCardStyle = styled(Grid)`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    gap: 12px;
    padding-bottom: 12px;
    justify-content: ${({ $isAssistant }) => ($isAssistant ? "flex-start" : "flex-end")};

    .conversation-card-header {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }

    .conversation-card-content {
        margin: 0;
        padding: 12px 20px;
        border-radius: 20px;
        word-break: break-word;
        max-width: 80%;
        line-height: 1.5;
        background-color: ${({ $isAssistant }) => ($isAssistant ? colors.white : colors.lightPrimary)};
        color: ${({ $isAssistant }) => ($isAssistant ? colors.primary : colors.white)};
        border: ${({ $isAssistant }) => ($isAssistant ? `1px solid ${colors.neutralTertiary}` : `1px solid ${colors.lightTertiary}`)};
        box-shadow: ${({ $isAssistant }) => ($isAssistant ? "0px 2px 4px rgba(0, 0, 0, 0.05)" : "none")};
    }

    .conversation-card-content.error {
        color: ${colors.white};
        background-color: ${colors.error};
        border: none;
    }
`;

export default CopilotConversationCardStyle;
