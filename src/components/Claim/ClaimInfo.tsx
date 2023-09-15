import React from "react";

import { Typography } from "antd";
import { useTranslation } from "next-i18next";
import LocalizedDate from "../LocalizedDate";
import colors from "../../styles/colors";
import styled from "styled-components";

const { Paragraph } = Typography;

const ClaimInfoParagraph = styled(Paragraph)`
    font-size: 10px;
    font-weight: 400;
    line-height: 15px;
    margin-bottom: 0;
    margin-top: 20px;
    color: ${colors.blackSecondary};
`;

const ClaimInfo = ({ isImage, date }) => {
    const { t } = useTranslation();

    return (
        <>
            {!isImage ? (
                <ClaimInfoParagraph>
                    {t("claim:cardHeader1")}&nbsp;
                    <LocalizedDate date={date || new Date()} />
                    &nbsp;
                    {t("claim:cardHeader2")}&nbsp;
                    <strong>{t("claim:typeSpeech")}</strong>
                </ClaimInfoParagraph>
            ) : (
                <ClaimInfoParagraph>
                    {t("claim:cardHeader3")}&nbsp;
                    <LocalizedDate date={date || new Date()} />
                </ClaimInfoParagraph>
            )}
        </>
    );
};

export default ClaimInfo;
