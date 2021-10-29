import ClaimSentence from "./ClaimSentence";
import React from "react";

const ClaimParagraph = ({ paragraph, showHighlights, generateHref }) => {
    const sentences = paragraph.content;
    return (
        <p id={paragraph.props.id}>
            {sentences.map(sentence => (
                <ClaimSentence
                    key={sentence.props.id}
                    content={sentence.content}
                    properties={sentence.props}
                    showHighlights={showHighlights}
                    generateHref={generateHref}
                    // onClaimReviewForm={onClaimReviewForm}
                />
            ))}
        </p>
    );
}

export default ClaimParagraph;
