import React from "react";
import { Row } from "antd";
import api from "../../api/personality";
import PersonalityCard from "./PersonalityCard";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Label from "../Label";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../store/store";
import { ActionTypes } from "../../store/types";

const PersonalitySearchResultSection = ({
    personalities,
    label,
    isCreatingClaim,
    setState,
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();

    const { claimType } = useAppSelector((state) => ({
        claimType: state.claimType,
    }));

    const createPersonality = async (personality) => {
        const personalityCreated = await api.createPersonality(personality, t);
        const { slug } = personalityCreated;
        const newPersonality = {
            ...personality,
            ...personalityCreated,
        };

        const createClaim = () => {
            setState(claimType);
            dispatch({
                type: ActionTypes.SET_CLAIM_CREATE_PERSONALITY,
                claimPersonality: newPersonality,
            });
        };

        // Redirect to personality list in case _id is not present
        const path = slug ? `/personality/${slug}` : "/personality";

        isCreatingClaim ? createClaim() : router.push(path);
    };

    return personalities.length ? (
        <Row
            style={{
                marginTop: "10px",
                width: "100%",
            }}
        >
            <Label>{label}</Label>

            {personalities.map(
                (p, i) =>
                    p && (
                        <PersonalityCard
                            setState={setState}
                            isCreatingClaim={isCreatingClaim}
                            personality={p}
                            summarized={true}
                            enableStats={false}
                            hrefBase="./"
                            onClick={createPersonality}
                            key={i}
                        />
                    )
            )}
        </Row>
    ) : null;
};

export default PersonalitySearchResultSection;
