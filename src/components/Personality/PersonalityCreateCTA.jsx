import { Button, Row } from "antd";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class PersonalityCreateCTA extends Component {
    render() {
        const { t } = this.props;
        return (
            <>
                <p>
                    <b>{t("personalityCTA:header")}</b>
                </p>

                <p>
                    <Button type="primary" href={this.props.href || `./create`}>
                        + {t("personalityCTA:button")}
                    </Button>
                </p>
                <p>{t("personalityCTA:footer")}</p>
            </>
        );
    }
}

export default withTranslation()(PersonalityCreateCTA);
