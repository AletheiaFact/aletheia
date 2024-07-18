import { Button, Col } from "antd";
import React, { useState, useEffect } from "react";
import topicApi from "../../api/topicsApi";
import sentenceApi from "../../api/sentenceApi";
import AutoComplete from "../Form/Autocomplete";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { EditFilled, PlusOutlined } from "@ant-design/icons";
import AletheiaButton from "../Button";
import TagsList from "./TagsList";
import { useAtom } from "jotai";
import { isUserLoggedIn } from "../../atoms/currentUser";
import { ContentModelEnum } from "../../types/enums";
import ImageApi from "../../api/image";
import { useDispatch } from "react-redux";

const TopicInput = ({ contentModel, data_hash, topics }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [showTopicsInput, setShowTopicsInput] = useState<boolean>(false);
    const [topicsArray, setTopicsArray] = useState<string[]>(topics);
    const [inputValue, setInputValue] = useState<string[]>([]);
    const [currentInputValue, setCurrentInputValue] = useState<string[]>([]);
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [showTopicErrorMessage, setShowTopicErrorMessage] =
        useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const [duplicatedErrorMessage, setDuplicatedErrorMessage] = useState("");

    const fetchTopicList = async (topic) => {
        const topicSearchResults = await topicApi.getTopics({
            topicName: topic,
            t: t,
            dispatch: dispatch,
        });
        return topicSearchResults.map((topic) => ({
            value: topic.name,
        }));
    };

    const handleClose = async (removedTopic: string) => {
        const newTopics = topicsArray.filter((topic) => topic !== removedTopic);
        const newInputValue = inputValue.filter(
            (topic) => topic !== removedTopic
        );
        setTopicsArray(newTopics);
        setInputValue(newInputValue);
        setCurrentInputValue(newInputValue);

        contentModel === ContentModelEnum.Image
            ? await ImageApi.deleteImageTopic(newTopics, data_hash)
            : await sentenceApi.deleteSentenceTopic(newTopics, data_hash);
    };

    const getDuplicated = (array1, array2) => {
        return array1.filter((object1) => {
            return array2.some((object2) => {
                return object1 === object2;
            });
        });
    };

    const duplicated = getDuplicated(inputValue, topicsArray);

    const handleEdit = () => {
        if (duplicated.length > 0) {
            setShowTopicErrorMessage(!showTopicErrorMessage);
        } else if (inputValue.length) {
            setTopicsArray(tags);
            setCurrentInputValue([]);
            topicApi
                .createTopics({ contentModel, topics: tags, data_hash }, t)
                .catch((e) => e);
        } else {
            setShowErrorMessage(!showErrorMessage);
        }
    };

    useEffect(() => {
        duplicated.length > 0
            ? setDuplicatedErrorMessage(duplicated.join(", "))
            : setShowTopicErrorMessage(false);

        const inputValueFormatted = inputValue.map((value) =>
            value.toLowerCase().replace(" ", "-")
        );

        const filterValues = inputValueFormatted.filter(
            (value) => !topicsArray.includes(value)
        );
        setTags(topicsArray?.concat(filterValues) || []);
    }, [inputValue, topicsArray]);

    return (
        <>
            <Col
                style={{
                    margin: "16px 16px 12px 16px",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    width: "calc(100% - 16px)",
                }}
            >
                <TagsList
                    tags={tags}
                    editable={isLoggedIn}
                    handleClose={handleClose}
                />

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
                        {tags.length ? <EditFilled /> : <PlusOutlined />}
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
                                preloadedTopics={topicsArray}
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
                            {showTopicErrorMessage && (
                                <span
                                    style={{
                                        width: "100%",
                                        marginLeft: 20,
                                        color: "#ff4d4f",
                                    }}
                                >
                                    {t("topics:duplicatedTopicError", {
                                        duplicatedTopics:
                                            duplicatedErrorMessage,
                                    })}
                                </span>
                            )}
                        </Col>
                    </>
                )}
            </Col>
        </>
    );
};

export default TopicInput;
