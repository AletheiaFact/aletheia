import React, { Component } from "react";
import colors from "../../constants/highlightColors";
import "./ClaimSentence.css";

class Sentence extends Component {
    render() {
        let style = {};
        const { props, content } = this.props;
        if (props.topClassification && this.props.showHighlights) {
            style = {
                backgroundColor: colors[props.topClassification.classification]
            };
        }
        return (
            <>
                <a
                    href="#"
                    id={props.id}
                    data-hash={props["data-hash"]}
                    style={style}
                    className="claim-sentence"
                    onClick={() =>
                        this.props.onClaimReviewForm({ props, content })
                    }
                >
                    {this.props.content}
                </a>
                {props.topClassification && this.props.showHighlights && (
                    <sup
                        style={{
                            color:
                                colors[props.topClassification.classification],
                            fontWeight: "600",
                            fontSize: "14px",
                            lineHeight: "22px",
                            paddingLeft: "5px"
                        }}
                    >
                        {props.topClassification.count}
                    </sup>
                )}
            </>
        );
    }
}

export default Sentence;
