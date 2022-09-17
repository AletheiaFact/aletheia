import React from "react";
import { Row } from "antd";
import api from "../../api/personality";
import PersonalityCard from "./PersonalityCard";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Label from "../Label";

const PersonalitySearchResultSection = ({
    personalities,
    label,
    isCreatingClaim,
    setState,
    setPersonalityClaim,
}) => {
    const { t } = useTranslation();
    const router = useRouter();

    const createPersonality = async (personality) => {
        const { slug } = await api.createPersonality(personality, t);
        // Redirect to personality list in case _id is not present
        const path = slug ? `/personality/${slug}` : "/personality";
        router.push(path);
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
                            setPersonalityClaim={setPersonalityClaim}
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
