import React, { useState } from "react";
import { Form, Row } from "antd";
import InputSearch from "../Form/InputSearch";
import api from "../../api/personality";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import Label from "../Label";
import PersonalitySearchResultSection from "./PersonalitySearchResultSection";
import { ActionTypes } from "../../store/types";
import { useRouter } from "next/router";

const PersonalityCreateSearch = ({
    withSuggestions,
    selectPersonality = null,
}) => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    const createPersonality = async (personality) => {
        setIsFormSubmitted(!isFormSubmitted);
        const personalityCreated = await api.createPersonality(personality, t);
        const { slug } = personalityCreated;
        const newPersonality = {
            ...personality,
            ...personalityCreated,
        };
        const createClaim = () => {
            selectPersonality(newPersonality);
            setIsFormSubmitted(false);
        };

        // Redirect to personality list in case _id is not present
        const path = slug ? `/personality/${slug}` : "/personality";
        if (selectPersonality !== null) {
            createClaim();
        } else {
            router.push(path);
        }
    };

    const onClickSeeProfile = () => {
        setIsFormSubmitted(!isFormSubmitted);
    };

    const { personalities } = useAppSelector((state) => {
        return {
            personalities: state?.search?.searchResults || [],
            searchName: state?.search?.searchInput || null,
        };
    });

    const handleInputSearch = (name) => {
        const trimmedName = name.trim();
        dispatch({
            type: ActionTypes.SET_SEARCH_NAME,
            searchName: trimmedName,
        });
        api.getPersonalities(
            { withSuggestions, searchName: trimmedName, i18n },
            dispatch
        );
    };

    const personalitiesCreated = personalities.filter(
        (personality) => personality && personality._id
    );
    const personalitiesAvailable = personalities.filter(
        (personality) => personality && !personality._id
    );

    return (
        <Row style={{ marginTop: "10px" }}>
            <Form
                style={{
                    width: "100%",
                }}
                layout="vertical"
            >
                <Form.Item
                    label={<Label>{t("personalityCreateForm:name")}</Label>}
                    style={{
                        width: "100%",
                        color: colors.blackSecondary,
                        fontSize: "14px",
                        lineHeight: "21px",
                    }}
                >
                    <InputSearch
                        placeholder={t("header:search_placeholder")}
                        callback={handleInputSearch}
                    />
                </Form.Item>
            </Form>
            <PersonalitySearchResultSection
                selectPersonality={selectPersonality}
                personalities={personalitiesCreated}
                label={t("personalityCTA:created")}
                onClick={onClickSeeProfile}
                isFormSubmitted={isFormSubmitted}
            />
            <PersonalitySearchResultSection
                selectPersonality={selectPersonality}
                personalities={personalitiesAvailable}
                label={t("personalityCTA:available")}
                onClick={createPersonality}
                isFormSubmitted={isFormSubmitted}
            />
        </Row>
    );
};

export default PersonalityCreateSearch;
