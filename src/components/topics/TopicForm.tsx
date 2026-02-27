import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import AletheiaButton from "../Button";
import TopicInputErrorMessages from "./TopicInputErrorMessages";
import { useTranslation } from "next-i18next";
import TopicsApi from "../../api/topicsApi";
import MultiSelectAutocomplete from "./TopicOrImpactSelect";
import verificationRequestApi from "../../api/verificationRequestApi";
import { ITopicForm } from "../../types/Topic";

const TopicForm = ({
    contentModel,
    data_hash,
    topicsArray,
    setTopicsArray,
    setSelectedTags,
    tags,
    reviewTaskType,
}: ITopicForm) => {
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const handleOnSubmit = async () => {
        try {
            setIsLoading(true);
            await TopicsApi.createTopics(
                { contentModel, topics: tags, data_hash },
                t
            );
            if (reviewTaskType === "VerificationRequest") {
                await verificationRequestApi.updateVerificationRequestWithTopics(
                    tags,
                    data_hash,
                    t
                );
            }
            setTopicsArray(tags);
            reset();
        } catch (error) {
            console.error("Error while adding topics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getDuplicatedTopics = (currentInputValue, topicsArray) =>
        topicsArray.filter(({ value }) =>
            currentInputValue.some((wikidataId) => wikidataId === value)
        );

    const validateDuplication = (value): boolean => {
        const duplicated = getDuplicatedTopics(value, topicsArray);
        return (
            duplicated.length <= 0 ||
            t("topics:duplicatedTopicError", {
                duplicatedTopics: duplicated
                    .map((topic) => topic.label)
                    .join(", "),
            })
        );
    };

    return (
        <form onSubmit={handleSubmit(handleOnSubmit)}>
            <Grid item style={{ display: "flex" }}>
                <Controller
                    control={control}
                    name="topics"
                    rules={{
                        validate: validateDuplication,
                    }}
                    render={({ field: { onChange, value } }) => (
                        <MultiSelectAutocomplete
                            placeholder={t("topics:placeholder")}
                            onChange={onChange}
                            setIsLoading={setIsLoading}
                            isLoading={isLoading}
                            setSelectedTags={setSelectedTags}
                            dataCy="testVerificationRequestTopicsInput"
                        />
                    )}
                />
                <AletheiaButton
                    htmlType="submit"
                    data-cy="testVerificationRequestAddTopicButton"
                    loading={isLoading}
                    style={{
                        height: 40,
                        borderRadius: 4,
                        borderTopRightRadius: 4,
                        borderBottomRightRadius: 4,
                        padding: "0 5px",
                        fontSize: 12,
                        marginLeft: 5,
                        textAlign: "center",
                        justifyContent: "center",
                    }}
                >
                    {t("topics:addTopicsButton")}
                </AletheiaButton>
            </Grid>

            <TopicInputErrorMessages errors={errors} />
        </form>
    );
};

export default TopicForm;
