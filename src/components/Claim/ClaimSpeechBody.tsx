import ClaimParagraph from "./ClaimParagraph";
import React from "react";

const ClaimSpeechBody = (props: {
    paragraphs: any;
    showHighlights: boolean;
    handleSentenceClick?: any;
}) => {
    return (
        <>
            {props.paragraphs.map((paragraph) => (
                <ClaimParagraph
                    handleSentenceClick={props.handleSentenceClick}
                    key={paragraph.props.id}
                    paragraph={paragraph}
                    showHighlights={props.showHighlights}
                />
            ))}
        </>
    );
};

export default ClaimSpeechBody;
