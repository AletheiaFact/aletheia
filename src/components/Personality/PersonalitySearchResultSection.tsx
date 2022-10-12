import { Row } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";

import api from "../../api/personality";
import Label from "../Label";
import PersonalityCard from "./PersonalityCard";

const PersonalitySearchResultSection = ({
    personalities,
    label,
    selectPersonality,
}) => {
    const { t } = useTranslation();
    const router = useRouter();

    const isCreatingClaim = selectPersonality !== null;

    const createPersonality = async (personality) => {
        const personalityCreated = await api.createPersonality(personality, t);
        const { slug } = personalityCreated;
        const newPersonality = {
            ...personality,
            ...personalityCreated,
        };
        const createClaim = () => {
            selectPersonality(newPersonality);
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
                            selectPersonality={selectPersonality}
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
