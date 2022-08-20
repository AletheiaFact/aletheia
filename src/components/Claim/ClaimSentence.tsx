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

const Sentence = ({
    showHighlights,
    properties,
    data_hash,
    content,
    generateHref,
}) => {
    let style = {};
    if (properties.classification && showHighlights) {
        style = {
            ...style,
            backgroundColor: highlightColors[properties.classification],
        };
    }
    const href = generateHref({ data_hash });
    return (
        <>
            <ClaimSentence
                href={href}
                id={data_hash}
                data-hash={data_hash}
                style={style}
                className="claim-sentence"
                data-cy={`frase${properties.id}`}
            >
                {content}{" "}
            </ClaimSentence>
            {properties.classification && showHighlights && (
                <sup
                    style={{
                        color: highlightColors[properties.classification],
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: "22px",
                        paddingLeft: "5px",
                    }}
                >
                    {1}
                </sup>
            )}
        </>
    );
};

export default Sentence;
