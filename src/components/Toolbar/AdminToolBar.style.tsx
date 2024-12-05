import { AppBar } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";

const AdminToolBarStyle = styled(AppBar)`
    .toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 4px 12px;
        padding: 0;
        min-height: 33px;
        border-bottom: 1px solid ${colors.lightNeutralSecondary};
        gap: 16px;
    }

    .toolbar-item {
        width: 26px;
        border-bottom: 1px solid ${colors.primary};
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toolbar-item > button {
        font-size: 16px;
        padding: 5px;
        background: none;
        border: none;
        font-size: 16;
        color: ${({ namespace }) =>
            namespace === NameSpaceEnum.Main
                ? colors.primary
                : colors.secondary};
    }
`;

export default AdminToolBarStyle;
