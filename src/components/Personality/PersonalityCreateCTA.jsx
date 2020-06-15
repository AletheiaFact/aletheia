import { Button, Row } from "antd";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class PersonalityCreateCTA extends Component {
    render() {
        const { t } = this.props;
        return (
            <>
                <p>
                    <b>{t("Didn't find who you were looking for?")}</b>
                </p>

                <p>
                    <Button type="primary" href={this.props.href || `./create`}>
                        + {t("Add personality")}
                    </Button>
                </p>
                <p>{t("And help us grow our database!")}</p>
            </>
        );
    }
}

export default withTranslation()(PersonalityCreateCTA);
