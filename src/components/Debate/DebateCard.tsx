import { Box, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import React from "react";

import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import CardBase from "../CardBase";
import PersonalityMinimalCard from "../Personality/PersonalityMinimalCard";
import { NameSpaceEnum } from "../../types/Namespace";
import { currentNameSpace } from "../../atoms/namespace";
import { Debate } from "../../types/Debates";
import DebateCardStyled from "./DebateCard.style";

interface DebateCardProps {
    debateClaim: Debate;
}

const DebateCard = ({ debateClaim }: DebateCardProps) => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const debateHref =
        nameSpace === NameSpaceEnum.Main
            ? `/claim/${debateClaim.claimId}/debate`
            : `/${nameSpace}/claim/${debateClaim.claimId}/debate`;

    const lastIndex = debateClaim.personalities.length - 1;

    return (
        <CardBase
            style={{
                width: "100%",
                padding: "clamp(10px, 3vw, 30px)",
                backgroundColor: colors.lightNeutral,
            }}
        >
            <DebateCardStyled>
                <Box className="debate-card-header">
                    <Box className="debate-card-live-badge">
                        <Box className="debate-card-live-dot" />
                        {t("debates:liveLabel")}
                    </Box>
                </Box>

                <Typography variant="h3" className="debate-card-title">
                    {debateClaim.title}
                </Typography>

                <Box className="debate-card-personalities">
                    {debateClaim.personalities.map((p, index) => (
                        <React.Fragment key={p._id}>
                            <Box className="debate-card-personality">
                                <PersonalityMinimalCard personality={p} />
                            </Box>

                            {index < lastIndex && (
                                <Box className="debate-card-vs">VS</Box>
                            )}
                        </React.Fragment>
                    ))}
                </Box>

                <Box className="debate-card-actions">
                    <AletheiaButton type={ButtonType.primary} href={debateHref}>
                        {t("debates:seeDebate")}
                    </AletheiaButton>
                </Box>
            </DebateCardStyled>
        </CardBase>
    );
};

export default DebateCard;
