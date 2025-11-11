import React, { useEffect, useState } from "react";
import { ContentModelEnum } from "../../types/enums";
import ImageApi from "../../api/image";
import TopicForm from "./TopicForm";
import { useTranslation } from "next-i18next";
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

    useEffect(() => {
        const inputValueFormatted = inputValue.map((inputValue) =>
            inputValue?.value
                ? {
                      label: inputValue?.label.toLowerCase().replace(" ", "-"),
                      value: inputValue?.value,
                      aliases: inputValue?.aliases || [],
                      matchedAlias: inputValue?.matchedAlias || null,
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
                data_hash,
                t
            );
        }

        return contentModel === ContentModelEnum.Image
            ? await ImageApi.deleteImageTopic(newTopicsArray, data_hash)
            : await SentenceApi.deleteSentenceTopic(
                  newTopicsArray,
                  data_hash,
                  t
              );
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
