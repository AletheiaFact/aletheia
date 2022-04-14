import React from "react";
import highlightColors from "../../constants/highlightColors";
import styled from "styled-components";
import colors from "../../styles/colors";

const ClaimSentence = styled.a`
    color: ${colors.bluePrimary};
    font-size: 18px;
    line-height: 27px;

    :hover {
        color: ${colors.bluePrimary};
        text-decoration: underline;
    }
`;

const Sentence = ({ showHighlights, properties, content, generateHref }) => {
    let style = {};
    if (properties.topClassification && showHighlights) {
        style = {
            ...style,
            backgroundColor: highlightColors[properties.topClassification.classification]
        };
    }
    const href = generateHref({ properties });
    return (
        <>
            <ClaimSentence
                href={href}
                id={properties["data-hash"]}
                data-hash={properties["data-hash"]}
                style={style}
                className="claim-sentence"
            >
                {content}
            </ClaimSentence>
            {properties.topClassification && showHighlights && (
                <sup
                    style={{
                        color:
                            highlightColors[properties.topClassification.classification],
                        fontWeight: 600,
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
