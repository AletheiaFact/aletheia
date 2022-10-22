import ClaimSentence from "./ClaimSentence";
import React from "react";

const ClaimParagraph = ({ paragraph, showHighlights, handleSentenceClick }) => {
    const sentences = paragraph.content;
    return (
        <p id={paragraph.props.id}>
            {sentences.map((sentence) => (
                <ClaimSentence
                    handleSentenceClick={handleSentenceClick}
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
