import { Row } from "antd";
import React from "react";

import Label from "../Label";
import PersonalityCard from "./PersonalityCard";

const PersonalitySearchResultSection = ({
    personalities,
    label,
    selectPersonality,
    isFormSubmitted,
    onClick,
}) => {
    const isCreatingClaim = selectPersonality !== null;

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
                            onClick={onClick}
                            key={i}
                            isFormSubmitted={isFormSubmitted}
                        />
                    )
            )}
        </Row>
    ) : null;
};

export default PersonalitySearchResultSection;
