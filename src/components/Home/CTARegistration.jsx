import { withTranslation } from "react-i18next";
import React from "react";
import { Button, Typography } from "antd";

const { Title } = Typography;
function CTARegistration(props) {
    return (
        <div
            style={{
                backgroundColor: "#2D77A3",
                textAlign: "center",
                padding: "30px"
            }}
        >
            <Title level={3} style={{ color: "#fff" }}>
                {props.t("CTARegistration:title")}
            </Title>
            <div
                style={{
                    color: "#fff",
                    fontSize: "14px",
                    textWeight: "600",
                    lineHeight: "21px",
                    marginBottom: "10px"
                }}
            >
                {props.t("CTARegistration:body")}
            </div>
            <div
                style={{
                    color: "#fff",
                    fontSize: "10px",
                    textWeight: "600",
                    lineHeight: "15px",
                    marginBottom: "17px"
                }}
            >
                {props.t("CTARegistration:footer")}
            </div>
            <Button
                shape="round"
                type="default"
                target="_blank"
                href="https://forms.gle/gaKKjrpLpsqwiQoEA"
                style={{
                    color: "#2D77A3",
                    borderColor: "#FFF",
                }}
            >
                <b
                    style={{
                        fontSize: "14px"
                    }}
                >
                    {props.t("CTARegistration:button")}
                </b>
            </Button>
        </div>
    );
}

export default withTranslation()(CTARegistration);
