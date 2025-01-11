import React from "react";
import { Grid } from "@mui/material";
import { Status } from "../../../types/enums";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import colors from "../../../styles/colors";

const HeaderStatusStyle = styled(Grid)`
    ::before {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: ${({ statuscolor }) => statuscolor};
        position: relative;
        margin-right: 5px;
    }
`;

const HeaderUserStatus = ({ status, style }) => {
    const { t } = useTranslation();
    const statusColor =
        status === Status.Active ? colors.active : colors.inactive;

    return (
        <HeaderStatusStyle statuscolor={statusColor} style={{ ...style }}>
            {t(`admin:user-status-${status}`)}
        </HeaderStatusStyle>
    );
};

export default HeaderUserStatus;
