import React, { useEffect, useState } from "react";
import { ContentModelEnum } from "../../types/enums";
import ImageApi from "../../api/image";
import TopicForm from "./TopicForm";
import TopicsApi from "../../api/topicsApi";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import TagDisplay from "./TagDisplay";
import SentenceApi from "../../api/sentenceApi";
import verificationRequestApi from "../../api/verificationRequestApi";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";

const TopicDisplay = ({
    data_hash,
    topics,
    reviewTaskType,
    contentModel = null,
}) => {
    const [showTopicsForm, setShowTopicsForm] = useState<boolean>(false);
    const [topicsArray, setTopicsArray] = useState<any[]>(topics);
    const [inputValue, setInputValue] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        const inputValueFormatted = inputValue.map((inputValue) =>
            inputValue?.value
                ? {
                      label: inputValue?.label.toLowerCase().replace(" ", "-"),
                      value: inputValue?.value,
                  }
                : inputValue
        );

        const filterValues = inputValueFormatted.filter(
            (inputValue) =>
                !topicsArray.some(
                    (topic) =>
                        (topic?.value || topic) ===
                        (inputValue?.value || inputValue)
                )
        );
        setTags(topicsArray?.concat(filterValues) || []);
    }, [inputValue, topicsArray]);

    const fetchTopicList = async (
        topic: string
    ): Promise<{ label: string; value: string }[]> => {
        const topicSearchResults = await TopicsApi.getTopics({
            topicName: topic,
            t: t,
            dispatch: dispatch,
        });

        return (
            topicSearchResults?.map((topic) => ({
                label: topic.name,
                value: topic.wikidata,
            })) || []
        );
    };

    const handleClose = async (removedTopicValue: any) => {
        const newTopicsArray = topicsArray.filter(
            (topic) => (topic?.value || topic) !== removedTopicValue
        );
        const newInputValue = inputValue.filter(
            (topic) => (topic?.value || topic) !== removedTopicValue
        );
        setTopicsArray(newTopicsArray);
        setInputValue(newInputValue);

        if (reviewTaskType === ReviewTaskTypeEnum.VerificationRequest) {
            return await verificationRequestApi.deleteVerificationRequestTopic(
                newTopicsArray,
                data_hash
            );
        }

        return contentModel === ContentModelEnum.Image
            ? await ImageApi.deleteImageTopic(newTopicsArray, data_hash)
            : await SentenceApi.deleteSentenceTopic(newTopicsArray, data_hash);
    };

    return (
        <>
            <TagDisplay
                handleClose={handleClose}
                tags={tags}
                setShowTopicsForm={setShowTopicsForm}
            />

            {showTopicsForm && (
                <TopicForm
                    contentModel={contentModel}
                    data_hash={data_hash}
                    fetchTopicList={fetchTopicList}
                    topicsArray={topicsArray}
                    setTopicsArray={setTopicsArray}
                    setInputValue={setInputValue}
                    tags={tags}
                    reviewTaskType={reviewTaskType}
                />
            )}
        </>
    );
};

export default TopicDisplay;
