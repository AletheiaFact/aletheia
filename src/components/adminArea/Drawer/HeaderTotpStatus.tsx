import React from "react";
import { Grid } from "@mui/material";
import styled from "styled-components";
import colors from "../../../styles/colors";
import { useTranslations } from "next-intl";

const HeaderTotpStatusStyle = styled(Grid)`
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

const HeaderTotpStatus = ({ status }) => {
    const tAdmin = useTranslations("admin");
    const statusColor = status === true ? colors.active : colors.inactive;

    return (
        <HeaderTotpStatusStyle statuscolor={statusColor}>
            {tAdmin(`user-status-${String(status)}`)}
        </HeaderTotpStatusStyle>
    );
};

export default HeaderTotpStatus;
