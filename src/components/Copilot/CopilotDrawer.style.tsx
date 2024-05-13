import colors from "../../styles/colors";
import styled from "styled-components";
import Drawer from "@mui/material/Drawer";

const CopilotDrawerStyled = styled(Drawer)`
    width: ${(props) => props.width};
    flex-shrink: 0;
    zindex: 999999;
    max-height: 100vh;
    overflow: hidden;

    & .MuiDrawer-paper {
        width: ${(props) => props.width};
        height: ${(props) => props.height};
        padding: 32px 16px 16px 16px;
        background: ${colors.lightGraySecondary};
    }

    .footer {
        font-size: 10px;
        text-align: center;
        margin-top: 8px;
    }

    .copilot-form {
        width: 100%;
        display: flex;
        align-items: flex-end;
        padding: 8px;
        gap: 8px;
        border-radius: 4px;
    }

    .submit-message-button {
        width: 24px;
        height: 44px;
        padding: 0;
        background: none;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
`;

export default CopilotDrawerStyled;
