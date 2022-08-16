import { Button, Col, Tag } from "antd";
import React, { useState, useEffect } from "react";
import topicApi from "../../api/topicsApi";
import sentenceApi from "../../api/sentenceApi";
import AutoComplete from "./Autocomplete";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { EditFilled } from "@ant-design/icons";
import AletheiaButton from "../Button";

const TopicInput = ({ sentence_hash, topics, isLoggedIn }) => {
    const { t } = useTranslation();
    const [showTopicsInput, setShowTopicsInput] = useState<boolean>(false);
    const [topicsArray, setTopicsArray] = useState<string[]>(topics);
    const [inputValue, setInputValue] = useState<string[]>([]);
    const [currentInputValue, setCurrentInputValue] = useState<string[]>([]);
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);

    const fetchTopicList = async (topic) => {
        const topicSearchResults = await topicApi.getTopics(topic, t);
        return topicSearchResults.map((topic) => ({
            value: topic.name,
        }));
    };

    const handleClose = async (removedTopic: string) => {
        const newTopics = tags.filter((topic) => topic !== removedTopic);
        setTopicsArray(newTopics);
        sentenceApi.deleteSentenceTopic(newTopics, sentence_hash);
    };

    const handleEdit = () => {
        if (inputValue.length) {
            setCurrentInputValue([]);
            topicApi.createTopics({ topics: tags, sentence_hash }, t);
        } else {
            setShowErrorMessage(!showErrorMessage);
        }
    };

    useEffect(() => {
        setTags(topicsArray.concat(inputValue));
    }, [inputValue]);

    return (
        <Col>
            <Col
                style={{
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Col>
                    {!tags.length && <span>{t("topics:noTopics")}</span>}

                    {tags &&
                        tags.map((tag) => (
                            <Tag
                                key={tag}
                                color={colors.bluePrimary}
                                closable={isLoggedIn}
                                onClose={() => handleClose(tag)}
                                style={{
                                    height: 32,
                                    borderRadius: 32,
                                    padding: "5px 10px",
                                }}
                            >
                                {tag.toUpperCase()}
                            </Tag>
                        ))}
                </Col>
                {isLoggedIn && (
                    <Button
                        onClick={() => {
                            setShowTopicsInput(!showTopicsInput);
                            setShowErrorMessage(false);
                        }}
                        style={{
                            padding: "5px",
                            background: "none",
                            border: "none",
                            fontSize: 16,
                            color: colors.bluePrimary,
                        }}
                    >
                        <EditFilled />
                    </Button>
                )}
            </Col>
            <Col>
                {showTopicsInput && (
                    <>
                        <Col style={{ display: "flex" }}>
                            <AutoComplete
                                placeholder={t("topics:placeholder")}
                                dataCy="testSearchTopics"
                                onChange={(value) => {
                                    setInputValue(value);
                                    setCurrentInputValue(value);
                                }}
                                mode="tags"
                                dataLoader={fetchTopicList}
                                style={{
                                    borderTopLeftRadius: 4,
                                    borderBottomLeftRadius: 4,
                                }}
                                value={currentInputValue}
                            />
                            <AletheiaButton
                                style={{
                                    height: 32,
                                    borderRadius: 0,
                                    borderTopRightRadius: 4,
                                    borderBottomRightRadius: 4,
                                    padding: "0 5px",
                                    fontSize: 12,
                                }}
                                onClick={() => handleEdit()}
                            >
                                {t("topics:addTopicsButton")}
                            </AletheiaButton>
                        </Col>
                        <Col>
                            {showErrorMessage && (
                                <span
                                    style={{
                                        width: "100%",
                                        marginLeft: 20,
                                        color: "#ff4d4f",
                                    }}
                                >
                                    {t("topics:inputRule")}
                                </span>
                            )}
                        </Col>
                    </>
                )}
            </Col>
        </Col>
    );
};

export default TopicInput;
