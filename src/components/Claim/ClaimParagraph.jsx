import ClaimSentence from "./ClaimSentence";
import React, { Component } from "react";

class ClaimParagraph extends Component {
    render() {
        const sentences = this.props.paragraph.content;
        return (
            <p id={this.props.paragraph.props.id}>
                {sentences.map(p => (
                    <ClaimSentence
                        key={p.props.id}
                        sentence={p}
                        onClaimReviewForm={this.props.onClaimReviewForm}
                    />
                ))}
            </p>
        );
    }
}

export default ClaimParagraph;
