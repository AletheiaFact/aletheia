import React from "react";
import colors from "../../constants/highlightColors";
import styled from "styled-components";

const ClaimSentence = styled.a`
    .claim-sentence {
        color: #111111;
        font-size: 18px;
        line-height: 27px;
    }

    .claim-sentence:hover {
        color: #111111;
        text-decoration: underline;
    }
`;

const Sentence = ({ showHighlights, properties, content, onClaimReviewForm}) => {
    let style = {};
    if (properties.topClassification && showHighlights) {
        style = {
            backgroundColor: colors[properties.topClassification.classification]
        };
    }
    return (
        <>
            <ClaimSentence
                href="#"
                id={properties.id}
                data-hash={properties["data-hash"]}
                style={style}
                className="claim-sentence"
                onClick={() =>
                    onClaimReviewForm({ properties, content })
                }
            >
                {content}
            </ClaimSentence>
            {properties.topClassification && showHighlights && (
                <sup
                    style={{
                        color:
                            colors[properties.topClassification.classification],
                        fontWeight: "600",
                        fontSize: "14px",
                        lineHeight: "22px",
                        paddingLeft: "5px"
                    }}
                >
                    {properties.topClassification.count}
                </sup>
            )}
        </>
    );
}

export default Sentence;
