import ClaimParagraph from "./ClaimParagraph";
import React from "react";

const ClaimSpeechBody = (props: {
    paragraphs: any;
    showHighlights: boolean;
}) => {
    return (
        <>
            {props.paragraphs.map((paragraph) => (
                <ClaimParagraph
                    key={paragraph.props.id}
                    paragraph={paragraph}
                    showHighlights={props.showHighlights}
                />
            ))}
        </>
    );
};

export default ClaimSpeechBody;
