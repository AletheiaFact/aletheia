import ClaimSentence from "./ClaimSentence";
import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

const ClaimParagraph = ({ paragraph, showHighlights, handleSentenceClick }) => {
    const dispatch = useDispatch();
    const sentences = paragraph.content;
    return (
        <p id={paragraph.props.id}>
            {sentences.map((sentence) => (
                <ClaimSentence
                    handleSentenceClick={() => {
                        dispatch(actions.setSelectSentence(sentence));
                        handleSentenceClick();
                    }}
                    key={sentence.props.id}
                    content={sentence.content}
                    properties={sentence.props}
                    data_hash={sentence.data_hash}
                    showHighlights={showHighlights}
                />
            ))}
        </p>
    );
};

export default ClaimParagraph;
