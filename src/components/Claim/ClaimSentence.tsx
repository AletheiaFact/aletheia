import React from "react";
import highlightColors from "../../constants/highlightColors";
import styled from "styled-components";
import colors from "../../styles/colors";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";

const Sentence = styled.a`
    color: ${colors.bluePrimary};
    font-size: 18px;
    line-height: 27px;

    :hover {
        color: ${colors.bluePrimary};
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
    if (properties.classification && showHighlights) {
        style = {
            ...style,
            backgroundColor: highlightColors[properties.classification],
        };
    }
    const dispatch = useDispatch();

    const handleClick = () => {
        handleSentenceClick();
        dispatch(actions.setSelectDataHash(data_hash));
        dispatch(actions.openReviewDrawer());
    };
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

export default ClaimSentence;
