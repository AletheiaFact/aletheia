import React, { useState } from "react";
import { FormControl, FormLabel, Grid } from '@mui/material';
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
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { NameSpaceEnum } from "../../types/Namespace";
import Loading from "../Loading";

const PersonalityCreateSearch = ({
    withSuggestions,
    selectPersonality = null,
}) => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const dispatch = useDispatch();

    const { personalities, searchName } = useAppSelector((state) => {
        return {
            personalities: state?.search?.searchPersonalitiesResults || [],
            searchName: state?.search?.searchInput || null,
        };
    });

    const createPersonality = async (personality) => {
        setIsLoading(true);
        try {
            setIsFormSubmitted(!isFormSubmitted);
            const personalityCreated = await api.createPersonality(
                personality,
                t
            );
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
                router
                    .push(
                        `/${nameSpace === NameSpaceEnum.Main ? "" : nameSpace
                        }${path}`
                    )
                    .catch((e) => e);
            }

            const headers = {
                "Cache-Control": "no-cache",
            };

            await api.getPersonalities(
                { withSuggestions, searchName: searchName, i18n, headers },
                dispatch
            );
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const onClickSeeProfile = () => {
        setIsFormSubmitted(!isFormSubmitted);
    };

    const handleInputSearch = async (name) => {
        setIsLoading(true);
        const trimmedName = name.trim();
        dispatch({
            type: ActionTypes.SET_SEARCH_NAME,
            searchName: trimmedName,
        });
        await api.getPersonalities(
            { withSuggestions, searchName: trimmedName, i18n },
            dispatch
        );
        setIsLoading(false);
    };

    const personalitiesCreated = personalities.filter(
        (personality) => personality && personality._id
    );
    const personalitiesAvailable = personalities.filter(
        (personality) => personality && !personality._id
    );

    return (
        <Grid container style={{ gap: 15, margin: "15px 0" }}>
            <FormControl
                style={{
                    width: "100%",
                }}
            >
                <FormLabel
                    style={{
                        width: "100%",
                        color: colors.blackSecondary,
                        fontSize: "14px",
                        lineHeight: "21px",
                        marginBottom: "5px",
                    }}
                >
                    <Label>
                        {t("personalityCreateForm:name")}
                    </Label>
                </FormLabel>
                <InputSearch
                    placeholder={t("header:search_placeholder")}
                    callback={handleInputSearch}
                />
            </FormControl>
            {isLoading ? (
                <Loading />
            ) : (
                <>
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
                </>
            )}
        </Grid>
    );
};

export default PersonalityCreateSearch;
