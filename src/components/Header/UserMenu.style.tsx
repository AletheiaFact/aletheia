import { Menu } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";

const UserMenuStyle = styled(Menu)`
    .menu-header {
        display: flex;
        width: 100%;
        padding: 10px;
        align-items: center;
        gap: 8px;
    }

    .menu-header-avatar {
        background: ${colors.quartiary};
        margin: 0px;
    }

    .menu-header-info {
        width: 100%;
        margin: 0;
    }

    .menu-header-info.email {
        font-size: 12px;
    }

    .menu-icon {
        width: 24px;
        height: 24px;
        background: transparent;
        color: ${({ namespace }) =>
            namespace === NameSpaceEnum.Main
                ? colors.primary
                : colors.secondary};
    }

    .select-menu-item {
        display: flex;
        justify-content: flex-end;
    }
`;

export default UserMenuStyle;
