import React from "react";
import { Col } from "antd";
import { Status } from "../../../types/enums";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import colors from "../../../styles/colors";

const HeaderStatusStyle = styled(Col)`
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

const HeaderUserStatus = ({ status }) => {
    const { t } = useTranslation();
    const statusColor =
        status === Status.Active ? colors.active : colors.inactive;

    return (
        <HeaderStatusStyle statuscolor={statusColor}>
            {t(`admin:user-status-${status}`)}
        </HeaderStatusStyle>
    );
};

export default HeaderUserStatus;
