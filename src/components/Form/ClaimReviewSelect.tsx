import { Select } from "antd";
import React from "react";
import {useTranslation} from "next-i18next";
import styled from "styled-components";
const { Option } = Select;

const SelectInput = styled(Select)`
    background: #F5F5F5;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
    border: none;
    height: 40px;

    .ant-select-selector {
        background: none !important;
        border: none !important;
        top: 6px;
        .ant-select-selection-item {
            color: #515151;
        }
    }

    ::placeholder {
        color: #515151;
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    }

    :active {
        border: none;
    }

    :hover {
        border: none;
    }
`;

const ClaimReviewSelect = ({ type, onChange, defaultValue }) => {
    const { t } = useTranslation();
    return (
        <SelectInput
            type={type}
            onChange={onChange}
            defaultValue={defaultValue}
        >
            <Option value="" disabled>
                {t("claimReviewForm:placeholder")}
            </Option>
            <Option value="not-fact">
                {t("claimReviewForm:not-fact")}
            </Option>
            <Option value="true">{t("claimReviewForm:true")}</Option>
            <Option value="true-but">
                {t("claimReviewForm:true-but")}
            </Option>
            <Option value="arguable">
                {t("claimReviewForm:arguable")}
            </Option>
            <Option value="misleading">
                {t("claimReviewForm:misleading")}
            </Option>
            <Option value="false">{t("claimReviewForm:false")}</Option>
            <Option value="unsustainable">
                {t("claimReviewForm:unsustainable")}
            </Option>
            <Option value="exaggerated">
                {t("claimReviewForm:exaggerated")}
            </Option>
            <Option value="unverifiable">
                {t("claimReviewForm:unverifiable")}
            </Option>
        </SelectInput>
    );
}

export default ClaimReviewSelect;
