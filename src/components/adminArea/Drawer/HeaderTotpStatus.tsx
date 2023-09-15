import React from "react";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import colors from "../../../styles/colors";

const HeaderTotpStatusStyle = styled(Col)`
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
    const { t } = useTranslation();
    const statusColor = status === true ? colors.active : colors.inactive;

    return (
        <HeaderTotpStatusStyle statuscolor={statusColor}>
            {t(`admin:user-status-${String(status)}`)}
        </HeaderTotpStatusStyle>
    );
};

export default HeaderTotpStatus;
