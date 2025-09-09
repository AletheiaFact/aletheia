import React from "react";
import highlightColors from "../../constants/highlightColors";
import styled from "styled-components";
import colors from "../../styles/colors";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";
import InfoTooltip from "./InfoTooltip";
import { InfoOutlined, SecurityOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";

const Sentence = styled.a`
    color: ${colors.primary};
    font-size: 18px;
    line-height: 27px;

    :hover {
        color: ${colors.primary};
        text-decoration: underline;
    }
`;

const ClaimSentence = ({
    showHighlights,
    properties,
    data_hash,
    content,
    handleSentenceClick,
}) => {
    let style = {};
    const { t } = useTranslation();
    if (properties.classification && showHighlights) {
        style = {
            ...style,
            backgroundColor: highlightColors[properties.classification],
        };
    }
    const dispatch = useDispatch();

    const handleClick = () => {
        handleSentenceClick();
        dispatch(actions.openReviewDrawer());
    };

    const tooltipContent = (
        <span
            style={{
                color: colors.primary,
                lineHeight: "20px",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 5
            }}
        >
            <SecurityOutlined fontSize="small" />
            {t("reviewTask:sentenceInfo")}
        </span>
    );

    return (
        <>
            <Sentence
                onClick={handleClick}
                id={data_hash}
                data-hash={data_hash}
                style={style}
                className="claim-sentence"
                data-cy={`frase${properties.id}`}
            >
                {content}{" "}
            </Sentence>
            {properties.classification === "in-progress" && showHighlights && (
                <sup
                    style={{
                        color: highlightColors[properties.classification],
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "22px",
                        padding: "0 4px 0 1px",
                    }}
                >
                    <InfoTooltip
                        children={<InfoOutlined style={{ fontSize: "18px", color: colors.neutralSecondary }} />}
                        content={tooltipContent}
                    />
                </sup>
            )}
        </>
    );
};

export default ClaimSentence;
