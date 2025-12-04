import React, { useEffect, useRef, useState } from "react";
import {
    Grid,
    Typography,
    Box,
    Alert,
    AlertTitle,
    FormControl,
    FormLabel,
} from "@mui/material";
import {
    WarningAmber,
    Public,
    DateRange,
    Filter,
    Share,
    ArrowBackOutlined,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import verificationRequestApi from "../../api/verificationRequestApi";
import {
    ReportModelEnum,
    ReviewTaskEvents,
    ReviewTaskTypeEnum,
} from "../../machines/reviewTask/enums";
import { Roles } from "../../types/enums";
import { VerificationRequestStatus } from "../../../server/verification-request/dto/types";
import { currentUserRole } from "../../atoms/currentUser";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import LargeDrawer from "../LargeDrawer";
import Loading from "../Loading";
import AletheiaButton, { ButtonType } from "../Button";
import TopicDisplay from "../topics/TopicDisplay";
import { MetaChip } from "./MetaChip";
import { VerificationRequestContent } from "./VerificationRequestContent";
import { RequestDates } from "./RequestDates";
import SourceList from "./SourceListVerificationRequest";
import { NameSpaceEnum } from "../../types/Namespace";
import { currentUserId } from "../../atoms/currentUser";
import reviewTaskApi from "../../api/reviewTaskApi";
import sendReviewNotifications from "../../notifications/sendReviewNotifications";
import AletheiaCaptcha from "../AletheiaCaptcha";

interface VerificationRequestDetailDrawerProps {
    verificationRequest: any;
    open: boolean;
    onClose: () => void;
    onUpdate?: (oldStatus: string, newStatus: string) => void;
}

const getSeverityColor = (severity: string) => {
    if (!severity) return colors.neutralSecondary;
    const lowerSeverity = severity.toLowerCase();
    if (lowerSeverity === "critical") return "#d32f2f";
    if (lowerSeverity.startsWith("high")) return "#f57c00";
    if (lowerSeverity.startsWith("medium")) return "#fbc02d";
    if (lowerSeverity.startsWith("low")) return "#388e3c";
    return colors.neutralSecondary;
};

const formatSeverityLabel = (severity: string) => {
    if (!severity) return "N/A";
    const parts = severity.split("_");
    if (parts.length === 2) {
        return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} (${
            parts[1]
        })`;
    }
    return severity.charAt(0).toUpperCase() + severity.slice(1);
};

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

const VerificationRequestDetailDrawer: React.FC<VerificationRequestDetailDrawerProps> =
    ({ verificationRequest, open, onClose, onUpdate }) => {
        const { t } = useTranslation();
        const { vw } = useAppSelector((state) => state);

        const [role] = useAtom(currentUserRole);
        const [isUpdating, setIsUpdating] = useState(false);
        const [currentRequest, setCurrentRequest] =
            useState(verificationRequest);
        const [userId] = useAtom(currentUserId);
        const [recaptchaString, setRecaptchaString] = useState("");
        const hasCaptcha = !!recaptchaString;
        const recaptchaRef = useRef(null);

        const canApprove =
            role === Roles.Admin ||
            role === Roles.SuperAdmin ||
            role === Roles.FactChecker ||
            role === Roles.Reviewer;

        useEffect(() => {
            setCurrentRequest(verificationRequest);
        }, [verificationRequest]);

        const handleStatusUpdate = async (
            newStatus: VerificationRequestStatus
        ) => {
            if (!currentRequest?._id) return;

            const oldStatus = currentRequest.status;

            setIsUpdating(true);
            try {
                // When approving/decline the verification request
                // Is necessary auto assign the verification request to the user
                // TODO: the group will be improved in the future, but for now we need to pass an empty array to the backend.
                const group = newStatus === "Posted" ? [] : undefined;
                const updatedRequest =
                    await verificationRequestApi.updateVerificationRequest(
                        currentRequest._id,
                        { status: newStatus, group },
                        t,
                        "update"
                    );

                if (newStatus === "Posted") {
                    await handleAutoAssign();
                }
                if (updatedRequest) {
                    onClose();
                    if (onUpdate) {
                        onUpdate(oldStatus, newStatus);
                    }
                }
            } catch (error) {
                console.error(
                    t("verificationRequest:errorUpdatingStatus"),
                    error
                );
            } finally {
                setIsUpdating(false);
            }
        };

        const handleAutoAssign = async () => {
            try {
                // TODO: add isSensitive and rejected in case of rejected
                // TODO: add targetId and usersId in the reviewTask
                const reviewTask = {
                    data_hash: verificationRequest.data_hash,
                    reportModel: ReportModelEnum.Request,
                    machine: {
                        context: {
                            reviewData: {
                                isSensitive: false,
                                rejected: false,
                                usersId: [userId],
                            },
                            review: {
                                isPartialReview: false,
                                personality: verificationRequest.personality,
                                targetId: "", // what is this?
                                usersId: "", // What is this?
                            },
                        },
                        value: "published",
                    },
                    recaptcha: recaptchaString,
                    nameSpace: NameSpaceEnum.Main,
                    reviewTaskType: ReviewTaskTypeEnum.VerificationRequest,
                    target: verificationRequest._id,
                };

                reviewTaskApi
                    .createReviewTask(reviewTask, t, ReviewTaskEvents.publish)
                    .then((response: any) => {
                        window.location.href = `/claim/create?verificationRequest=${verificationRequest._id}`;
                    })
                    .catch((e) => {
                        // TODO: Track errors with Sentry
                    });
                // .finally(() => resetIsLoading());
                sendReviewNotifications(
                    verificationRequest.data_hash,
                    ReviewTaskEvents.publish,
                    reviewTask,
                    userId,
                    t
                );
            } catch (error) {
                console.error("Erro ao auto atribuir:", error);
            }
        };

        const handleApprove = () => {
            handleStatusUpdate(VerificationRequestStatus.POSTED);
        };

        const handleDecline = () => {
            handleStatusUpdate(VerificationRequestStatus.DECLINED);
        };

        const metaChipData = currentRequest
            ? [
                  {
                      icon: <Filter style={{ fontSize: 18 }} />,
                      key: `${currentRequest._id}|reportType`,
                      label: t("verificationRequest:tagReportType"),
                      label_value: t(
                          `claimForm:${
                              currentRequest.reportType || "undefined"
                          }`
                      ),
                      style: {
                          backgroundColor: colors.secondary,
                          color: colors.white,
                      },
                  },
                  {
                      icon: <Share style={{ fontSize: 18 }} />,
                      key: `${currentRequest._id}|receptionChannel`,
                      label: t("verificationRequest:tagSourceChannel"),
                      label_value: currentRequest.sourceChannel,
                      style: {
                          backgroundColor: colors.primary,
                          color: colors.white,
                      },
                  },
                  {
                      icon: <Public style={{ fontSize: 18 }} />,
                      key: `${currentRequest._id}|impactArea`,
                      label: t("verificationRequest:tagImpactArea"),
                      label_value: currentRequest.impactArea?.name,
                      style: {
                          backgroundColor: colors.neutralSecondary,
                          color: colors.white,
                      },
                  },
                  {
                      icon: <WarningAmber style={{ fontSize: 18 }} />,
                      key: `${currentRequest._id}|severity`,
                      label: t("verificationRequest:tagSeverity"),
                      label_value:
                          formatSeverityLabel(currentRequest.severity) || "N/A",
                      style: {
                          backgroundColor: getSeverityColor(
                              currentRequest.severity
                          ),
                          color: colors.white,
                      },
                  },
              ]
            : [];

        return (
            <>
                <LargeDrawer open={open} onClose={onClose}>
                    {currentRequest ? (
                        <Grid
                            style={{
                                width: "100%",
                                padding: "24px 32px",
                                display: "flex",
                                gap: "24px",
                                height: "100%",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <Grid
                                item
                                xs={12}
                                style={{
                                    gap: "24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Grid item style={{ display: "flex", gap: 32 }}>
                                    <AletheiaButton
                                        startIcon={
                                            <ArrowBackOutlined
                                                style={{ marginRight: "10px" }}
                                                fontSize="small"
                                            />
                                        }
                                        onClick={() => onClose()}
                                        type={ButtonType.gray}
                                    >
                                        {t("common:back_button")}
                                    </AletheiaButton>
                                    <Grid item xs={vw?.xs ? 4 : 7}>
                                        <AletheiaButton
                                            href={`/verification-request/${currentRequest.data_hash}`}
                                            target="_blank"
                                            type={ButtonType.gray}
                                            style={{
                                                textDecoration: "underline",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {t(
                                                "verificationRequest:viewFullPage"
                                            )}
                                        </AletheiaButton>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                        }}
                                    >
                                        <Alert severity="info">
                                            <Typography
                                                variant="h2"
                                                sx={{
                                                    fontFamily: "initial",
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                {t(
                                                    "verificationRequest:tagReportedContent"
                                                )}
                                            </Typography>
                                            <AlertTitle>
                                                <Typography
                                                    variant="body1"
                                                    style={{
                                                        color: colors.black,
                                                        fontSize: "14px",
                                                        whiteSpace: "pre-wrap",
                                                    }}
                                                >
                                                    {currentRequest.content}
                                                </Typography>
                                            </AlertTitle>
                                        </Alert>

                                        <Box
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: "12px",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            {currentRequest.date && (
                                                <RequestDates
                                                    icon={
                                                        <DateRange
                                                            style={{
                                                                fontSize: 18,
                                                                color: "grey",
                                                            }}
                                                        />
                                                    }
                                                    label={t(
                                                        "verificationRequest:tagDate"
                                                    )}
                                                    value={currentRequest.date}
                                                />
                                            )}
                                            {currentRequest.publicationDate && (
                                                <RequestDates
                                                    icon={
                                                        <DateRange
                                                            style={{
                                                                fontSize: 18,
                                                                color: "grey",
                                                            }}
                                                        />
                                                    }
                                                    label={t(
                                                        "verificationRequest:tagPublicationDate"
                                                    )}
                                                    value={
                                                        currentRequest.publicationDate
                                                    }
                                                />
                                            )}
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                            }}
                                        >
                                            <SourceList
                                                sources={currentRequest.source}
                                                t={t}
                                                truncateUrl={truncateUrl}
                                                id={currentRequest._id}
                                            />
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                            }}
                                        >
                                            {currentRequest.heardFrom && (
                                                <VerificationRequestContent
                                                    label={t(
                                                        "verificationRequest:tagHeardFrom"
                                                    )}
                                                    value={
                                                        currentRequest.heardFrom
                                                    }
                                                />
                                            )}

                                            {currentRequest.additionalInfo && (
                                                <VerificationRequestContent
                                                    label={t(
                                                        "verificationRequest:tagAdditionalInfo"
                                                    )}
                                                    value={
                                                        currentRequest.additionalInfo
                                                    }
                                                />
                                            )}
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                gap: "12px",
                                                justifyContent: "space-around",
                                            }}
                                        >
                                            {metaChipData.map(
                                                ({
                                                    icon,
                                                    key,
                                                    label,
                                                    label_value,
                                                    style,
                                                }) => (
                                                    <Box key={key}>
                                                        <MetaChip
                                                            icon={icon}
                                                            label={label}
                                                            label_value={
                                                                label_value
                                                            }
                                                            style={style}
                                                        />
                                                    </Box>
                                                )
                                            )}
                                        </Box>
                                    </Box>

                                    <Box
                                        style={{
                                            marginTop: "24px",
                                        }}
                                    >
                                        <TopicDisplay
                                            data_hash={currentRequest.data_hash}
                                            reviewTaskType={
                                                ReviewTaskTypeEnum.VerificationRequest
                                            }
                                            topics={
                                                currentRequest?.topics || []
                                            }
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                            {canApprove &&
                                currentRequest.status === "In Triage" && (
                                    <>
                                        <FormControl
                                            fullWidth
                                            id="createClaim"
                                            style={{ padding: "32px 0" }}
                                        >
                                            <FormLabel>
                                                <AletheiaCaptcha
                                                    onChange={
                                                        setRecaptchaString
                                                    }
                                                    ref={recaptchaRef}
                                                />
                                            </FormLabel>
                                        </FormControl>
                                        <Grid
                                            item
                                            xs={12}
                                            style={{
                                                gap: "24px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            <Box
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    gap: 12,
                                                }}
                                            >
                                                <AletheiaButton
                                                    type={ButtonType.blue}
                                                    onClick={handleApprove}
                                                    disabled={
                                                        isUpdating ||
                                                        !hasCaptcha
                                                    }
                                                >
                                                    {t("common:approve")}
                                                </AletheiaButton>
                                                <AletheiaButton
                                                    type={ButtonType.blue}
                                                    onClick={handleDecline}
                                                    disabled={
                                                        isUpdating ||
                                                        !hasCaptcha
                                                    }
                                                    style={{
                                                        backgroundColor:
                                                            colors.error ||
                                                            "#d32f2f",
                                                        color: colors.white,
                                                        borderColor:
                                                            colors.error ||
                                                            "#d32f2f",
                                                    }}
                                                >
                                                    {t("common:reject")}
                                                </AletheiaButton>
                                            </Box>
                                        </Grid>
                                    </>
                                )}
                        </Grid>
                    ) : null}
                    {isUpdating && (
                        <Loading
                            style={{
                                position: "absolute",
                                top: 0,
                                height: "100%",
                                background: "rgba(0,0,0,.1)",
                            }}
                        />
                    )}
                </LargeDrawer>
            </>
        );
    };

export default VerificationRequestDetailDrawer;
