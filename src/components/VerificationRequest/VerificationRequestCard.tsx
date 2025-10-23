import { Grid, Typography, Button, Alert, AlertTitle, Box } from "@mui/material";
import { WarningAmber, Public, DateRange, Filter, Share } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CardBase from "../CardBase";
import colors from "../../styles/colors";
import { MetaChip } from "./MetaChip";
import { VerificationRequestContent } from "./VerificationRequestContent";
import { RequestDates } from "./RequestDates";
import SourceList from "./SourceListVerificationRequest";

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    word-wrap: break-word;
    overflow: hidden;
    width: 50vw;
    
    @media (max-width: 768px) {
        flex-direction: column;
        width: 70vw;
        flex-wrap: "wrap";
    }
`;

const MetaChipContainer = styled(Grid)`
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
    flex-wrap: wrap;
`;

const smallGreyIcon = { fontSize: 18, color: "grey" };

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

    const metaChipData = [
        {
            icon: <Filter style={{ fontSize: 18 }} />,
            key: `${verificationRequest._id}|reportType`,
            label: t("verificationRequest:tagReportType"),
            label_value: t(`claimForm:${verificationRequest.reportType}`),
            style: { backgroundColor: colors.secondary, color: colors.white }
        },
        {
            icon: <Share style={{ fontSize: 18 }} />,
            key: `${verificationRequest._id}|receptionChannel`,
            label: t("verificationRequest:tagSourceChannel"),
            label_value: verificationRequest.sourceChannel,
            style: { backgroundColor: colors.primary, color: colors.white }
        },
        {
            icon: <Public style={{ fontSize: 18 }} />,
            key: `${verificationRequest._id}|impactArea`,
            label: t("verificationRequest:tagImpactArea"),
            label_value: verificationRequest.impactArea?.name,
            style: { backgroundColor: colors.neutralSecondary, color: colors.white }
        },
        {
            icon: <WarningAmber style={{ fontSize: 18 }} />,
            key: `${verificationRequest._id}|severity`,
            label: t("verificationRequest:tagSeverity"),
            label_value: "Alta", // Dynamic Field: It must be populated with the severy of the Verification Request
            style: { backgroundColor: colors.error, color: colors.white }
        }
    ]

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
        <CardBase style={{ padding: "32px", ...style }}>
            <ContentWrapper>
                <Alert severity="info">
                    <Typography variant="h2"
                        sx={{ fontFamily: "initial", fontSize: "18px", fontWeight: "bold", marginBottom: "2px" }}>
                        {t("verificationRequest:tagReportedContent")}
                    </Typography>
                    <AlertTitle>
                        <Typography
                            variant="body1"
                            style={{
                                color: colors.black,
                                fontSize: "14px",
                            }}>
                            {verificationRequest.content}
                        </Typography>
                    </AlertTitle>
                </Alert>

                <Grid item style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", flexWrap: "wrap" }}>
                    {verificationRequest.publicationDate && (
                        <RequestDates
                            icon={<DateRange style={smallGreyIcon} />}
                            label={t("verificationRequest:tagPublicationDate")}
                            value={verificationRequest.publicationDate}
                        />
                    )}


                    {verificationRequest.date && (
                        <RequestDates
                            icon={<DateRange style={smallGreyIcon} />}
                            label={t("verificationRequest:tagDate")}
                            value={verificationRequest.date}
                        />
                    )}
                </Grid>
                <Box mt={2}>
                    {verificationRequest.heardFrom && (
                        <VerificationRequestContent
                            label={t("verificationRequest:tagHeardFrom")}
                            value={verificationRequest.heardFrom || " "}
                        />
                    )}
                </Box>
                <Box mt={2}>
                    {verificationRequest.source && (
                        <SourceList
                            sources={verificationRequest.source}
                            t={t}
                            truncateUrl={truncateUrl}
                            id={verificationRequest._id}
                        />
                    )}
                </Box>

                <MetaChipContainer container>
                    {metaChipData.map(({ icon, key, label, label_value, style }) => (
                        <Grid item key={key} style={{ marginBottom: "8px" }}>
                            <MetaChip
                                icon={icon}
                                label={label}
                                label_value={label_value}
                                style={style}
                            />
                        </Grid>
                    ))}
                </MetaChipContainer>

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
        </CardBase>
    );
};

export default VerificationRequestCard;
