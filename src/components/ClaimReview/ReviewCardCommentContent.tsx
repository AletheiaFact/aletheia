import React from "react";

import { Typography } from "antd";
import colors from "../../styles/colors";
import ClaimSummary from "../Claim/ClaimSummary";
import ImageClaim from "../ImageClaim";
const { Paragraph } = Typography;

const ClaimReviewCardContent = ({ isImage, content }) => {
    return (
        <ClaimSummary
            style={{
                padding: "12px 16px",
                width: "100%",
                height: "8.4em",
            }}
        >
            <Paragraph
                style={{ marginBottom: 0 }}
                ellipsis={{
                    rows: 4,
                    expandable: false,
                }}
            >
                <cite
                    style={{
                        fontStyle: "normal",
                        fontSize: 16,
                        color: colors.blackPrimary,
                    }}
                >
                    {isImage ? <ImageClaim src={content} /> : content}
                </cite>
            </Paragraph>
        </ClaimSummary>
    );
};

export default ClaimReviewCardContent;
