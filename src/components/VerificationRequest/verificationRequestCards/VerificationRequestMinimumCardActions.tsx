import React from "react";
import { Box, Grid, Link, Typography } from "@mui/material";
import TagsList from "../../topics/TagsList";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import AletheiaAvatar from "../../AletheiaAvatar";
import { Topic } from "../../../types/Topic";
import { PersonalityWithWikidata } from "../../../types/PersonalityWithWikidata";
import { useTranslations } from "next-intl";

interface VerificationRequestMinimumCardActionsProps {
    verificationRequestId: string;
    dataHash: string;
    topics: Topic[];
    personalities: PersonalityWithWikidata[];
}

const VerificationRequestMinimumCardActions = ({
    verificationRequestId,
    dataHash,
    topics,
    personalities,
}: VerificationRequestMinimumCardActionsProps) => {
    const tags = topics?.map((topic) => ({
        name: topic.aliases?.[0] || topic.name
    })) || [];
    const tVerificationRequest = useTranslations("verificationRequest");

    return (
        <Grid item className="verification-actions">
            <TagsList key={verificationRequestId} tags={tags} />
            <Box className="verification-actions-row">
                <Box>
                    <Typography variant="caption" className="verification-actions-caption">
                        {tVerificationRequest("identifiedPersonalities")}
                    </Typography>

                    <Box className="verification-actions-avatars">
                        {personalities.map((person) => (
                            <Link href={`/personality/${person.slug}`}>
                                <AletheiaAvatar
                                    size={40}
                                    src={person.avatar || undefined}
                                    alt={person.name}
                                />
                            </Link>
                        ))}
                    </Box>
                </Box>
                <AletheiaButton
                    type={ButtonType.primary}
                    href={`/verification-request/${dataHash}`}
                >
                    {tVerificationRequest("openVerificationRequest")}
                </AletheiaButton>
            </Box>
        </Grid>
    )
}

export default VerificationRequestMinimumCardActions;
