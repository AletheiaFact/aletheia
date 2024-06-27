import { Typography } from "antd";
import React from "react";
import colors from "../../styles/colors";
import CardBase from "../CardBase";

const VerificationRequestCard = ({ content, actions = [] }) => {
    return (
        <CardBase style={{ padding: 32 }}>
            <Typography.Paragraph
                style={{
                    marginBottom: 0,
                    color: colors.blackPrimary,
                    margin: 0,
                    lineHeight: 1.6,
                }}
                ellipsis={{ rows: 4, expandable: true }}
            >
                {content}
            </Typography.Paragraph>

            {actions ? actions.map((action) => action) : <></>}
        </CardBase>
    );
};

export default VerificationRequestCard;
