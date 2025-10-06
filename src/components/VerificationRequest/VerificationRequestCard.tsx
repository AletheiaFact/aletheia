import { Grid, Typography, Button, Alert, AlertTitle, Box } from "@mui/material";
import DateRangeIcon from '@mui/icons-material/DateRange';
import FilterIcon from '@mui/icons-material/Filter';
import ShareIcon from '@mui/icons-material/Share';
import PublicIcon from '@mui/icons-material/Public';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CardBase from "../CardBase";
import Link from "next/link";
import colors from "../../styles/colors";
import { MetaChip } from "./MetaChip";
import { ContentVR } from "./VerificationRequestContent";
import { RequestDates } from "./RequestDates";

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    word-wrap: break-word;
    overflow: hidden;
    width: 50vw;
    
    @media (max-width: 768px) {
        flex-direction: column;
        width: 70vw;
        flexWrap: "wrap",
    }
`;

const truncateUrl = (url) => {
    try {
        const { hostname, pathname } = new URL(url);
        const maxLength = 30;
        const shortPath =
            pathname.length > maxLength
                ? `${pathname.substring(0, maxLength)}...`
                : pathname;
        return `${hostname}${shortPath}`;
    } catch (e) {
        return url;
    }
};

const VerificationRequestCard = ({
    verificationRequest,
    actions = [],
    expandable = true,
    t,
    style = {},
}) => {
    const [visible, setVisible] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);

    const handleToggle = () => {
        setVisible(true);
    };

    useEffect(() => {
        if (textRef.current) {
            const isOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
            setIsOverflowing(isOverflow);
        }
    }, [verificationRequest.content]);

    return (
        <CardBase style={{ padding: 32, ...style }}>
            <ContentWrapper>
                <Alert severity="info">
                    <Typography variant="h2"
                        style={{
                            fontFamily: "initial",
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 8,
                        }}>
                        {t("verificationRequest:reportedContent")}
                    </Typography>
                    <AlertTitle>
                        <Typography
                            variant="body1"
                            style={{
                                color: colors.black,
                                fontSize: 14,
                            }}>
                            {verificationRequest.content}
                        </Typography>
                    </AlertTitle>
                </Alert>

                <Grid item style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", flexWrap: "wrap" }}>
                    {verificationRequest.publicationDate && (() => {
                        return (
                            <RequestDates
                                icon={<DateRangeIcon style={{ fontSize: 18, color: "grey" }} />}
                                label={t("verificationRequest:verificationRequestTagPublicationDate")}
                                value={verificationRequest.publicationDate}
                            />
                        );
                    })()}

                    {verificationRequest.date && (
                        <RequestDates
                            icon={<DateRangeIcon style={{ fontSize: 18, color: "grey" }} />}
                            label={t("verificationRequest:verificationRequestTagDate")}
                            value={verificationRequest.date}
                        />
                    )}
                </Grid>
                <Box mt={2}>
                    {verificationRequest.heardFrom && (
                        <ContentVR
                            label={t("verificationRequest:verificationRequestTagHeardFrom")}
                            value={verificationRequest.heardFrom || " "}
                        />
                    )}
                </Box>
                <Box mt={2}>
                    {verificationRequest.source && (
                        <ContentVR
                            label={t("verificationRequest:verificationRequestTagSource")}
                            value={
                                <Link href={verificationRequest.source.href} passHref>
                                    <a target="_blank" rel="noopener noreferrer">
                                        {truncateUrl(verificationRequest.source.href)}
                                    </a>
                                </Link>
                            }
                        />
                    )}
                </Box>

                <Grid container style={{ display: "flex", justifyContent: "space-around", marginTop: "16px" }}>
                    <Grid item style={{ display: "flex", alignItems: "center" }}>
                        <MetaChip
                            icon={<FilterIcon style={{ fontSize: 18 }} />}
                            label={t("verificationRequest:contentTypeLabel")}
                            label_value="Imagem" // Dynamic Field: It must be populated with type Verification Request
                            color="primary"
                        />
                    </Grid>

                    <Grid item style={{ display: "flex", alignItems: "center" }}>
                        <MetaChip
                            icon={<ShareIcon style={{ fontSize: 18 }} />}
                            label={t("verificationRequest:receptionChannelLabel")}
                            label_value="Instagram" // Dynamic Field: It must be populated with the channel reception of the Verification Request
                            color="secondary"
                        />
                    </Grid>

                    <Grid item style={{ display: "flex", alignItems: "center" }}>
                        <MetaChip
                            icon={<PublicIcon style={{ fontSize: 18 }} />}
                            label={t("verificationRequest:impactAreaLabel")}
                            label_value="Meio ambiente" // Dynamic Field: It must be populated with the area of impact of the Verification Request
                            color="success"
                        />
                    </Grid>

                    <Grid item style={{ display: "flex", alignItems: "center" }}>
                        <MetaChip
                            icon={<WarningAmberIcon style={{ fontSize: 18 }} />}
                            label={t("verificationRequest:severityLabel")}
                            label_value="Alta" // Dynamic Field: It must be populated with the severy of the Verification Request
                            color="error"
                        />
                    </Grid>

                </Grid>


                {expandable && !visible && isOverflowing && (
                    <Button
                        variant="text"
                        style={{ marginLeft: "auto", color: colors.lightPrimary, textDecoration: 'underline', padding: 0 }}
                        onClick={handleToggle}
                    >
                        {t("verificationRequest:showText")}
                    </Button>
                )}
            </ContentWrapper>

            <Grid item
                style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent:
                        actions.length > 1 ? "space-around" : "flex-end",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "100%",
                }}
            >
                {actions ? actions.map((action) => action) : <></>}
            </Grid>
        </CardBase >
    );
};

export default VerificationRequestCard;
