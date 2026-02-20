import { useSelector } from "@xstate/react";
import { Grid, Box, Chip, Tooltip } from "@mui/material";
import React, { useContext, useMemo } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import {
    reviewingSelector,
    publishedSelector,
    crossCheckingSelector,
    reportSelector,
    addCommentCrossCheckingSelector,
    assignedSelector,
} from "../../machines/reviewTask/selectors";
import colors from "../../styles/colors";
<<<<<<< HEAD
import CTAFolder from "../Home/CTAFolder/CTAFolder";
=======
>>>>>>> 0234bfee (feat: implement centralized RBAC permission system with enhanced UX)
import SentenceReportContent from "./SentenceReportContent";
import { useAtom } from "jotai";
import {
    debugModeAtom,
    debugOverrideRoleAtom,
    debugRoleAtom,
    debugAssignmentTypeAtom,
    DebugAssignmentType,
} from "../../atoms/currentUser";
import SentenceReportComments from "./SentenceReportComments";
import { ReviewTaskTypeEnum } from "../../../server/types/enums";
import { ReviewTaskStates } from "../../machines/reviewTask/enums";
import { useTranslation } from "next-i18next";
import userApi from "../../api/userApi";
import { useState, useEffect } from "react";
import { useReviewTaskPermissions } from "../../machines/reviewTask/usePermissions";

const SentenceReportView = ({
    context,
    userIsNotRegular,
    isHidden,
    href,
    componentStyle,
}) => {
    const { t } = useTranslation();
    // Debug panel UI controls (setters only)
    const [debugMode, setDebugMode] = useAtom(debugModeAtom);
    const [debugOverrideRole, setDebugOverrideRole] = useAtom(
        debugOverrideRoleAtom
    );
    const [debugRole, setDebugRole] = useAtom(debugRoleAtom);
    const [debugAssignmentType, setDebugAssignmentType] = useAtom(
        debugAssignmentTypeAtom
    );

    const { machineService, publishedReview, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );

    // Centralized permissions (includes debug overrides for assignments and roles)
    const permissions = useReviewTaskPermissions();

    // Machine state selectors (about workflow state, not permissions)
    const isReport = useSelector(machineService, reportSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isAddCommentCrossChecking = useSelector(
        machineService,
        addCommentCrossCheckingSelector
    );
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isAssigned = useSelector(machineService, assignedSelector);
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;

    // Show comments/classification based on centralized permissions + machine state
    const canShowClassificationAndCrossChecking =
        ((isCrossChecking || isAddCommentCrossChecking) &&
            (permissions.isAdmin || permissions.isCrossChecker)) ||
        (isReviewing && (permissions.isAdmin || permissions.isReviewer)) ||
        (isReport &&
            (permissions.isAdmin ||
                permissions.isAssignee ||
                permissions.isCrossChecker));

    // Only show SentenceReportContent if the report is published
    const shouldShowReportContent = useMemo(() => {
        return isPublished || publishedReview?.review;
    }, [isPublished, publishedReview]);

    // Get current state for status display
    const currentState = useMemo(() => {
        const state = machineService.state.value;
        if (typeof state === "string") return state;
        return Object.keys(state)[0] || "unknown";
    }, [machineService.state.value]);

    // State for user name resolution
    const [userNames, setUserNames] = useState({});

    // Get assigned fact-checker info
    const assignedFactChecker = useMemo(() => {
        if (context.reviewerId) {
            return { id: context.reviewerId, type: "Reviewer" };
        }
        if (context.crossCheckerId) {
            return { id: context.crossCheckerId, type: "Cross-Checker" };
        }
        if (context.usersId && context.usersId.length > 0) {
            return { id: context.usersId[0], type: "Assignee" };
        }
        return null;
    }, [context.reviewerId, context.crossCheckerId, context.usersId]);

    // Fetch user names for assigned users
    useEffect(() => {
        const fetchUserNames = async () => {
            const userIds = [];
            if (context.reviewerId) userIds.push(context.reviewerId);
            if (context.crossCheckerId) userIds.push(context.crossCheckerId);
            if (context.usersId) userIds.push(...context.usersId);

            const names = {};
            await Promise.all(
                userIds.map(async (id) => {
                    try {
                        const user = await userApi.getById(id);
                        names[id] = user?.name || user?.email || id;
                    } catch (error) {
                        names[id] = id; // Fallback to ID if fetch fails
                    }
                })
            );
            setUserNames(names);
        };

        if (assignedFactChecker) {
            fetchUserNames();
        }
    }, [
        context.reviewerId,
        context.crossCheckerId,
        context.usersId,
        assignedFactChecker,
    ]);

    // State color mapping
    const getStateColor = (state: string) => {
        switch (state) {
            case ReviewTaskStates.unassigned:
                return "default";
            case ReviewTaskStates.assigned:
                return "primary";
            case ReviewTaskStates.submitted:
                return "warning";
            case ReviewTaskStates.crossChecking:
                return "info";
            case ReviewTaskStates.reported:
                return "secondary";
            case ReviewTaskStates.published:
                return "success";
            default:
                return "default";
        }
    };

    return (
        reviewTaskType !== ReviewTaskTypeEnum.VerificationRequest && (
            <Grid
                container
                justifyContent="center"
                style={
                    isCrossChecking || isReport || isReviewing
                        ? { backgroundColor: colors.lightNeutral }
                        : undefined
                }
            >
                <Grid item xs={componentStyle.span}>
                    {/* Debug Panel */}
                    {debugMode && (
                        <Box
                            style={{
                                backgroundColor: "#ffeb3b",
                                padding: "12px",
                                margin: "16px 0",
                                borderRadius: "4px",
                                border: "2px solid #f57f17",
                                fontSize: "12px",
                                fontFamily: "monospace",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                }}
                            >
                                <strong>DEBUG MODE</strong>
                                <button
                                    onClick={() => setDebugMode(!debugMode)}
                                    style={{
                                        background: debugMode
                                            ? "#f44336"
                                            : "#4caf50",
                                        color: "white",
                                        border: "none",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        fontSize: "10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {debugMode ? "DISABLE" : "ENABLE"}
                                </button>
                            </div>

                            <div style={{ marginBottom: "8px" }}>
                                <div style={{ marginBottom: "8px" }}>
                                    <strong>Assignment Type:</strong>
                                    <select
                                        value={debugAssignmentType}
                                        onChange={(e) =>
                                            setDebugAssignmentType(
                                                e.target
                                                    .value as DebugAssignmentType
                                            )
                                        }
                                        style={{
                                            marginLeft: "8px",
                                            padding: "2px 4px",
                                        }}
                                    >
                                        <option
                                            value={DebugAssignmentType.None}
                                        >
                                            None (Use Natural)
                                        </option>
                                        <option
                                            value={DebugAssignmentType.Assignee}
                                        >
                                            Assigned User
                                        </option>
                                        <option
                                            value={DebugAssignmentType.Reviewer}
                                        >
                                            Assigned Reviewer
                                        </option>
                                        <option
                                            value={
                                                DebugAssignmentType.CrossChecker
                                            }
                                        >
                                            Assigned Cross-Checker
                                        </option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: "8px" }}>
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            margin: "4px 0",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={debugOverrideRole}
                                            onChange={(e) =>
                                                setDebugOverrideRole(
                                                    e.target.checked
                                                )
                                            }
                                            style={{ marginRight: "6px" }}
                                        />
                                        Override Role:
                                        <select
                                            value={debugRole}
                                            onChange={(e) =>
                                                setDebugRole(
                                                    e.target.value as any
                                                )
                                            }
                                            disabled={!debugOverrideRole}
                                            style={{
                                                marginLeft: "8px",
                                                padding: "2px 4px",
                                            }}
                                        >
                                            <option value="regular">
                                                Regular
                                            </option>
                                            <option value="fact-checker">
                                                Fact-Checker
                                            </option>
                                            <option value="reviewer">
                                                Reviewer
                                            </option>
                                            <option value="admin">Admin</option>
                                            <option value="super-admin">
                                                Super-Admin
                                            </option>
                                        </select>
                                    </label>
                                </div>
                            </div>

                            <div style={{ marginTop: "8px", fontSize: "11px" }}>
                                <strong>Current State:</strong> isAssigned=
                                {String(isAssigned)}, isAssignee=
                                {String(permissions.isAssignee)}, readonly=
                                {String(permissions.editorReadonly)}
                            </div>
                        </Box>
                    )}

                    {/* Header with status chips - only show when not published */}
                    {!(isPublished || publishedReview?.review) && (
                        <Box
                            style={{
                                padding: "16px 20px",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                marginBottom: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                flexWrap: "wrap",
                                backgroundColor: "rgba(245, 245, 245, 0.5)",
                                borderRadius: "8px",
                            }}
                        >
                            {/* State chip */}
                            <Chip
                                label={
                                    t(`reviewTask:${currentState}`) ||
                                    currentState
                                }
                                color={getStateColor(currentState)}
                                variant="filled"
                                size="medium"
                                style={{
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                }}
                            />

                            {/* Assigned fact-checker chip */}
                            {assignedFactChecker && (
                                <Chip
                                    label={`${assignedFactChecker.type}: ${
                                        userNames[assignedFactChecker.id] ||
                                        assignedFactChecker.id
                                    }`}
                                    color="primary"
                                    variant="outlined"
                                    size="medium"
                                    style={{
                                        fontWeight: 500,
                                        fontSize: "0.875rem",
                                    }}
                                />
                            )}

                            {/* View Only indicator */}
                            {permissions.editorReadonly && (
                                <Tooltip
                                    title={
                                        t("claimReviewForm:viewOnlyMode") ||
                                        "You are viewing this report in read-only mode. The content is visible but cannot be edited."
                                    }
                                    arrow
                                    placement="top"
                                >
                                    <Chip
                                        label={
                                            t("common:viewOnly") || "View Only"
                                        }
                                        color="warning"
                                        variant="outlined"
                                        size="medium"
                                        style={{
                                            backgroundColor:
                                                "rgba(255, 193, 7, 0.1)",
                                            cursor: "help",
                                            fontWeight: 500,
                                            fontSize: "0.875rem",
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    )}

                    {canShowClassificationAndCrossChecking && (
                        <SentenceReportComments context={context} />
                    )}

                    {/* SentenceReportContent section - only show if published */}
                    {shouldShowReportContent && (
                        <SentenceReportContent
                            context={context?.reviewDataHtml || context}
                            classification={context.classification}
                            showClassification={
                                canShowClassificationAndCrossChecking
                            }
                            href={href}
                        />
                    )}
                </Grid>
            </Grid>
        )
    );
};

export default SentenceReportView;
