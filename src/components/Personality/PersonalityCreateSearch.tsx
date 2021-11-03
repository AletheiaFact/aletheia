import React from "react";
import { Form, Row } from "antd";
import InputSearch from "../Form/InputSearch";
import api from "../../api/personality";
import PersonalityCard from "./PersonalityCard";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

const PersonalityCreateSearch = ({ withSuggestions }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const router = useRouter();

    const { personalities } = useSelector(
        (state) => {
            return {
                personalities: state?.search?.searchResults || [],
                searchName: state?.search?.searchInput || null
            };
        }
    );

    const createPersonality = async (personality) => {
        const { slug } = await api.createPersonality(personality, t);
        // Redirect to personality list in case _id is not present
        const path = slug ? `/personality/${slug}` : "/personality";
        router.push(path);
    }

    const handleInputSearch = (name) => {
        dispatch({
            type: "SET_SEARCH_NAME",
            searchName: name
        });
        api.getPersonalities({ withSuggestions, personalities, searchName: name }, dispatch);
    }

    return (
        <Row style={{ marginTop: "10px" }}>
            <Form
                style={{
                    width: "100%"
                }}
            >
                <Form.Item
                    label={t("personalityCreateForm:name")}
                    style={{
                        width: "100%",
                        color: "#595959",
                        fontSize: "14px",
                        lineHeight: "21px",
                    }}
                >
                    <InputSearch
                        placeholder={t("header:search_personality")}
                        callback={handleInputSearch}
                    />
                </Form.Item>
            </Form>
            {personalities.map(
                (p, i) =>
                    p && (
                        <PersonalityCard
                            personality={p}
                            summarized={true}
                            enableStats={false}
                            suggestion
                            hrefBase="./"
                            onClick={createPersonality}
                            key={i}
                        />
                    )
            )}
        </Row>
    );
}

export default PersonalityCreateSearch;
