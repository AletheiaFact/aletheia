import { useEffect, useState } from "react";
import { cop30Api } from "../api/cop30Api";
import { ContentModelEnum } from "../types/enums";

export function useSentencesByTopic(topicId) {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSentences() {
            setIsLoading(true);

            try {
                const sentences = await cop30Api.getSentences();
                console.log("API Response:", sentences);

                const filteredSentences = sentences.filter((sentence) =>
                    sentence.topics?.some((topic) => topic.value === topicId)
                );
                console.log("Filtered Sentences:", filteredSentences);

                const formatted = filteredSentences.map((sentence) => {
                    const claimData = Array.isArray(sentence.claim)
                        ? sentence.claim[0]
                        : sentence.claim;

                    return {
                        claim: {
                            ...claimData,
                            contentModel:
                                claimData?.contentModel ||
                                ContentModelEnum.Speech,
                            date: claimData?.date,
                            title: claimData?.title,
                            id: claimData?.id,
                        },
                        content: {
                            ...sentence,
                            content: sentence.content || sentence.text,
                            topics:
                                sentence.topics?.map((topic) => ({
                                    label: topic.label,
                                    value: topic.value,
                                })) || [],
                            props: {
                                classification: sentence.classification,
                            },
                            data_hash: sentence.data_hash,
                        },
                        reviewHref: `/claim/${sentence.claimId}/sentence/${sentence.data_hash}`,
                    };
                });

                setReviews(formatted);
            } catch (err) {
                console.error("Error fetching sentences by topic:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }

        if (topicId) {
            fetchSentences();
        }
    }, [topicId]);

    return { reviews, isLoading, error };
}
