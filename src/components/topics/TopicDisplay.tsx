import React, { useEffect, useState } from "react";
import { ContentModelEnum } from "../../types/enums";
import ImageApi from "../../api/image";
import TopicForm from "./TopicForm";
import { useTranslation } from "next-i18next";
import TagDisplay from "./TagDisplay";
import SentenceApi from "../../api/sentenceApi";
import verificationRequestApi from "../../api/verificationRequestApi";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";
import { ITopicDisplay } from "../../types/Topic";

const TopicDisplay = ({
    data_hash,
    topics,
    reviewTaskType,
    contentModel = null,
}: ITopicDisplay) => {
    const [showTopicsForm, setShowTopicsForm] = useState<boolean>(false);
    const [topicsArray, setTopicsArray] = useState<any[]>(topics);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const formattedSelectedTags = selectedTags.map((selectedTag) =>
            selectedTag?.value
                ? {
                    label: selectedTag?.label,
                    value: selectedTag?.value,
                    aliases: selectedTag?.aliases || [],
                    matchedAlias: selectedTag?.matchedAlias || null,
                }
                : selectedTag
        );

        const filterSelectedTags = formattedSelectedTags.filter(
            (selectedTag) =>
                !topicsArray.some(
                    (topic) =>
                        (topic?.value || topic) ===
                        (selectedTag?.value || selectedTag)
                )
        );
        setTags(topicsArray?.concat(filterSelectedTags) || []);
    }, [selectedTags, topicsArray]);

    const handleClose = async (removedTopicValue: any) => {
        // NOTE: Filtering logic differs due to inconsistent data structures across collections:
        // 1. topicsArray: May contain persisted topics from VerificationRequest, requiring 'wikidataId' as an identifier.
        // 2. selectedTags: Follows the 'ManualTopic' UI schema, which consistently uses 'value'.
        const newTopicsArray = topicsArray.filter(
            (topic) => (topic?.value || topic?.wikidataId || topic) !== removedTopicValue
        );
        const newSelectedTag = selectedTags.filter(
            (topic) => (topic?.value || topic) !== removedTopicValue
        );
        setTopicsArray(newTopicsArray);
        setSelectedTags(newSelectedTag);

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
                    setSelectedTags={setSelectedTags}
                    tags={tags}
                    reviewTaskType={reviewTaskType}
                />
            )}
        </>
    );
};

export default TopicDisplay;
