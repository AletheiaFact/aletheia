import { Grid, Typography } from "@mui/material"
import React from "react";
import colors from "../../styles/colors";
import { ContentModelEnum } from "../../types/enums";
import LocalizedDate from "../LocalizedDate";
import { useTranslations } from "next-intl";

const ClaimCardHeader = ({
    personality,
    date,
    claimType = ContentModelEnum.Speech,
}) => {
    const tClaim = useTranslations("claim");
    const isImage = claimType === ContentModelEnum.Image;
    const speechTypeMapping = {
        [ContentModelEnum.Speech]: tClaim("typeSpeech"),
        [ContentModelEnum.Image]: tClaim("typeImage"),
        [ContentModelEnum.Debate]: tClaim("typeDebate"),
        [ContentModelEnum.Unattributed]: tClaim("typeUnattributed"),
    };

    const speechTypeTranslation = speechTypeMapping[claimType];
    return (
        <Grid item
            xs={12}
            style={{
                color: colors.blackSecondary,
                width: "100%",
            }}
        >
            {personality && (
                <>
                    <Typography
                        variant="body1"
                        style={{
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontWeight: 600,
                            marginBottom: 0,
                            color: colors.black,
                        }}
                    >
                        {personality.name}
                    </Typography>

                    <Grid container>
                        <Typography
                            variant="body1"
                            style={{
                                fontSize: 10,
                                fontWeight: 400,
                                lineHeight: "18px",
                                marginBottom: 0,
                            }}
                        >
                            {personality.description}
                        </Typography>
                    </Grid>
                </>
            )}
            <Grid container>
                {!isImage ? (
                    <Typography
                        variant="body1"
                        style={{
                            fontSize: 10,
                            fontWeight: 400,
                            lineHeight: "15px",
                            marginBottom: 0,
                            color: colors.blackSecondary,
                        }}
                    >
                        {tClaim("cardHeader1")}&nbsp;
                        <LocalizedDate date={date || new Date()} />
                        &nbsp;
                        {tClaim("cardHeader2")}&nbsp;
                        <span style={{ fontWeight: 700 }}>
                            {speechTypeTranslation}
                        </span>
                    </Typography>
                ) : (
                    <Typography
                        variant="body1"
                        style={{
                            fontSize: 10,
                            fontWeight: 400,
                            lineHeight: "15px",
                            marginBottom: 0,
                            color: colors.blackSecondary,
                        }}
                    >
                        {tClaim("cardHeader3")}
                        &nbsp;
                        <LocalizedDate date={date || new Date()} />
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};

export default ClaimCardHeader;
