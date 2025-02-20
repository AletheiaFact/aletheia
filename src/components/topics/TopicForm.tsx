import { Grid } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormControl from "@mui/joy/FormControl";
import Autocomplete from "@mui/joy/Autocomplete";
import CircularProgress from "@mui/joy/CircularProgress";
import AletheiaButton from "../Button";
import TopicInputErrorMessages from "./TopicInputErrorMessages";
import { useTranslation } from "next-i18next";
import TopicsApi from "../../api/topicsApi";
import { ContentModelEnum } from "../../types/enums";
import { CssVarsProvider } from "@mui/joy/styles";

interface ITopicForm {
    contentModel: ContentModelEnum;
    data_hash: string;
    fetchTopicList: (
        topicName: string
    ) => Promise<{ label: string; value: string }[]>;
    topicsArray: any[];
    setTopicsArray: (topicsArray) => void;
    setInputValue: (inputValue) => void;
    tags: any[];
    reviewTaskType: string;
}

const TopicForm = ({
    contentModel,
    data_hash,
    fetchTopicList,
    topicsArray,
    setTopicsArray,
    setInputValue,
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
    const [options, setOptions] = useState([]);
    const { t } = useTranslation();
    const rules = {
        required: t("common:requiredFieldError"),
        validate: { duplicated: (v) => validateDuplication(v) },
    };

    const fetchOptions = async (inputValue: string) => {
        if (inputValue.length >= 3) {
            setIsLoading(true);
            const fetchedOptions = await fetchTopicList(inputValue);
            setOptions(fetchedOptions);
            setIsLoading(false);
        } else {
            setOptions([]);
        }
    };

    const handleOnSubmit = async () => {
        try {
            setIsLoading(true);
            await TopicsApi.createTopics(
                { contentModel, topics: tags, data_hash, reviewTaskType },
                t
            );
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
                        <CssVarsProvider>
                            <FormControl sx={{ width: "100%" }}>
                                <Autocomplete
                                    freeSolo
                                    multiple
                                    placeholder={t("topics:placeholder")}
                                    options={options}
                                    onInputChange={(_, inputValue) =>
                                        fetchOptions(inputValue)
                                    }
                                    onChange={(_, selectedValues) => {
                                        onChange(selectedValues);
                                        setInputValue(selectedValues);
                                    }}
                                    getOptionLabel={(option) =>
                                        option.label || ""
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                        option.value === value.value
                                    }
                                    loading={isLoading}
                                    endDecorator={
                                        isLoading ? (
                                            <CircularProgress size="sm" />
                                        ) : null
                                    }
                                />
                            </FormControl>
                        </CssVarsProvider>
                    )}
                />
                <AletheiaButton
                    htmlType="submit"
                    loading={isLoading}
                    style={{
                        height: 35,
                        borderRadius: 4,
                        borderTopRightRadius: 4,
                        borderBottomRightRadius: 4,
                        padding: "0 5px",
                        fontSize: 12,
                        marginLeft: 5,
                        textAlign: "center",
                        justifyContent: "center",
                        lineHeight: "13px",
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
