import ClaimSentence from "./ClaimSentence";
import React from "react";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";
import SentenceApi from "../../api/sentenceApi";

const ClaimParagraph = ({ paragraph, showHighlights, handleSentenceClick }) => {
    const dispatch = useDispatch();
    const sentences = paragraph.content;
    return (
        <p id={paragraph.props.id}>
            {sentences.map((sentence) => (
                <ClaimSentence
                    handleSentenceClick={() => {
                        SentenceApi.getSentenceTopicsByDatahash(
                            sentence.data_hash
                        ).then((sentenceWithTopics) => {
                            dispatch(
                                actions.setSelectContent(sentenceWithTopics)
                            );
                        });

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
