import { Col, Typography } from "antd";
import React from "react";
import colors from "../../styles/colors";
import CardBase from "../CardBase";

const VerificationRequestCard = ({
    content,
    actions = [],
    expandable = true,
    style = {},
}) => {
    return (
        <CardBase style={{ padding: 32, ...style }}>
            <Typography.Paragraph
                style={{
                    marginBottom: 0,
                    color: colors.blackPrimary,
                    margin: 0,
                    lineHeight: 1.6,
                }}
                ellipsis={{ rows: 4, expandable }}
            >
                {content}
            </Typography.Paragraph>

            <Col
                style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent:
                        actions.length > 1 ? "space-around" : "flex-end",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "100%",
                }}
            >
                {actions ? actions.map((action) => action) : <></>}
            </Col>
        </CardBase>
    );
};

export default VerificationRequestCard;
