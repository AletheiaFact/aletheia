import React from "react";
import { Box, Grid, Link, Typography } from "@mui/material";
import TagsList from "../../topics/TagsList";
import AletheiaButton, { ButtonType } from "../../Button";
import AletheiaAvatar from "../../AletheiaAvatar";
import { Topic } from "../../../types/Topic";
import { PersonalityWithWikidata } from "../../../types/PersonalityWithWikidata";

interface VerificationRequestMinimumCardActionsProps {
    verificationRequestId: string;
    dataHash: string;
    topics: Topic[];
    personalities: PersonalityWithWikidata[];
    t: (key: string) => string;
}

const VerificationRequestMinimumCardActions = ({
    verificationRequestId,
    dataHash,
    topics,
    personalities,
    t
}: VerificationRequestMinimumCardActionsProps) => {
    const tags = topics?.map((topic) => ({
        name: topic.aliases?.[0] || topic.name
    })) || [];

    return (
        <Grid item className="verification-actions">
            <TagsList key={verificationRequestId} tags={tags} />
            <Box className="verification-actions-row">
                <Box>
                    <Typography variant="caption" className="verification-actions-caption">
                        {t("verificationRequest:identifiedPersonalities")}
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
                <AletheiaButton type={ButtonType.blue} href={`/verification-request/${dataHash}`}>
                    {t("verificationRequest:openVerificationRequest")}
                </AletheiaButton>
            </Box>
        </Grid>
    )
}

export default VerificationRequestMinimumCardActions;
