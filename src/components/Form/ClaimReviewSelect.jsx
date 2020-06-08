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
}

export default withTranslation()(ClaimReviewSelect);
