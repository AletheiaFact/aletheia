import React from "react";
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

const PersonalityCreateSearch = ({ withSuggestions }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

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
            { withSuggestions, personalities, searchName: trimmedName, i18n },
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
                personalities={personalitiesCreated}
                label={t("personalityCTA:created")}
            />
            <PersonalitySearchResultSection
                personalities={personalitiesAvailable}
                label={t("personalityCTA:available")}
            />
        </Row>
    );
};

export default PersonalityCreateSearch;
