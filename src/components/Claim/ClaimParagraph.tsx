import ClaimSentence from "./ClaimSentence";
import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";
import SentenceApi from "../../api/sentenceApi";
import { ViewMode } from "../FilterToggleButtons";

type ClaimParagraphProps = {
    paragraph: any;
    showHighlights: ViewMode;
    handleSentenceClick: any;

}

const ClaimParagraph = ({ paragraph, showHighlights, handleSentenceClick }: ClaimParagraphProps) => {
    const dispatch = useDispatch();
    const sentences = paragraph.content;
    return (
        <p id={paragraph.props.id} style={{ wordBreak: "break-all" }}>
            {sentences.map((sentence) => (
                <ClaimSentence
                    handleSentenceClick={() => {
                        SentenceApi.getSentenceTopicsByDatahash(
                            sentence.data_hash
                        )
                            .then((sentenceWithTopics) => {
                                dispatch(
                                    actions.setSelectContent(sentenceWithTopics)
                                );
                            })
                            .catch((e) => e);

                        if (handleSentenceClick) {
                            handleSentenceClick();
                        }
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
