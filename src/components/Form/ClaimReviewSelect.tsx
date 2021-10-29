import { Select } from "antd";
import React from "react";
import {useTranslation} from "next-i18next";

const { Option } = Select;

const ClaimReviewSelect = ({ type, onChange, defaultValue }) => {
    const { t } = useTranslation();
    return (
        <Select
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
        </Select>
    );
}

export default ClaimReviewSelect;
