import ClaimSentence from "./ClaimSentence";
import React, { Component } from "react";

class ClaimParagraph extends Component {
    render() {
        const sentences = this.props.paragraph.content;
        return (
            <p id={this.props.paragraph.props.id}>
                {sentences.map(sentence => (
                    <ClaimSentence
                        key={sentence.props.id}
                        content={sentence.content}
                        props={sentence.props}
                        showHighlights={this.props.showHighlights}
                        onClaimReviewForm={this.props.onClaimReviewForm}
                    />
                ))}
            </p>
        );
    }
}

export default ClaimParagraph;
