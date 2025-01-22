import { Grid } from "@mui/material";
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
        <Grid container
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
                            onClick={onClick}
                            key={i}
                            isFormSubmitted={isFormSubmitted}
                        />
                    )
            )}
        </Grid>
    ) : null;
};

export default PersonalitySearchResultSection;
