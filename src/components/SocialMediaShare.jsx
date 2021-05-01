import React, { Component } from "react";
import { Row } from "antd";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    TelegramShareButton,
    TelegramIcon
} from "react-share";
import { withTranslation } from "react-i18next";

class SocialMediaShare extends Component {
    render() {
        const { t } = this.props;
        const quote = this.props.quote || t("share:quote");
        return (
            <Row
                style={{
                    background: "#F5F5F5",
                    borderRadius: "30px",
                    margin: "45px 15px",
                    padding: "20px 0px"
                }}
            >
                <div
                    style={{
                        width: "100%",
                        textAlign: "center",
                        fontSize: "26px",
                        lineHeight: "39px"
                    }}
                >
                    {t("share:title")}
                </div>
                <div
                    style={{
                        width: "100%",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "space-evenly",
                        padding: "0px 20%",
                        marginTop: "15px"
                    }}
                >
                    <FacebookShareButton
                        url={window.location.href}
                        quote={quote}
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton
                        url={window.location.href}
                        quote={quote}
                    >
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton
                        url={window.location.href}
                        quote={quote}
                    >
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <TelegramShareButton
                        url={window.location.href}
                        quote={quote}
                    >
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </div>
            </Row>
        );
    }
}

export default withTranslation()(SocialMediaShare);
