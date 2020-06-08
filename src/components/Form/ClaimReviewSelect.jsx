import { Select } from "antd";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";

const { Option } = Select;

class ClaimReviewSelect extends Component {
    render() {
        const { t } = this.props;
        return (
            <Select
                type={this.props.type}
                onChange={this.props.onChange}
                defaultValue={this.props.defaultValue}
            >
                <Option value="" disabled>
                    {t("claimReviewSelect:placeholder")}
                </Option>
                <Option value="not-fact">
                    {t("claimReviewSelect:not-fact")}
                </Option>
                <Option value="true">{t("claimReviewSelect:true")}</Option>
                <Option value="true-but">
                    {t("claimReviewSelect:true-but")}
                </Option>
                <Option value="arguable">
                    {t("claimReviewSelect:arguable")}
                </Option>
                <Option value="misleading">
                    {t("claimReviewSelect:misleading")}
                </Option>
                <Option value="false">{t("claimReviewSelect:false")}</Option>
                <Option value="unsustainable">
                    {t("claimReviewSelect:unsustainable")}
                </Option>
                <Option value="exaggerated">
                    {t("claimReviewSelect:exaggerated")}
                </Option>
                <Option value="unverifiable">
                    {t("claimReviewSelect:unverifiable")}
                </Option>
            </Select>
        );
    }
}

export default withTranslation()(ClaimReviewSelect);
