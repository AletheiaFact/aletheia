import React, { useContext, useState } from "react";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import styled from "styled-components";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { ReviewTaskStates } from "../../../machines/reviewTask/enums";
import { currentUserId } from "../../../atoms/currentUser";
import { currentNameSpace } from "../../../atoms/namespace";
import reviewTaskApi from "../../../api/reviewTaskApi";
import colors from "../../../styles/colors";

const BannerStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: rgb(239, 246, 255);
    border-bottom: 1px solid rgb(191, 219, 254);
    gap: 12px;

    .banner-message {
        font-size: 13px;
        color: ${colors.primary};
    }

    .banner-button {
        padding: 6px 14px;
        border: none;
        border-radius: 8px;
        background: rgb(37, 99, 235);
        color: ${colors.white};
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.15s;

        &:hover {
            background: rgb(29, 78, 216);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
`;

interface AssignmentBannerProps {
    dataHash: string;
    personalityId?: string;
    targetId?: string;
}

const AssignmentBanner = ({
    dataHash,
    personalityId,
    targetId,
}: AssignmentBannerProps) => {
    const { t } = useTranslation();
    const [userId] = useAtom(currentUserId);
    const [nameSpace] = useAtom(currentNameSpace);
    const [assigning, setAssigning] = useState(false);
    const { machineService, reportModel, reviewTaskType } = useContext(ReviewTaskMachineContext);

    const stateValue = machineService?.state?.value;
    const isUnassigned = stateValue === ReviewTaskStates.unassigned;

    if (!isUnassigned || !userId) return null;

    const handleAssign = async () => {
        setAssigning(true);
        try {
            const currentContext = machineService.state.context;
            await reviewTaskApi.autoSaveDraft(
                {
                    data_hash: dataHash,
                    machine: {
                        value: ReviewTaskStates.assigned,
                        context: {
                            ...currentContext,
                            reviewData: {
                                ...currentContext.reviewData,
                                usersId: [userId],
                            },
                            review: {
                                ...currentContext.review,
                                personality: personalityId,
                            },
                        },
                    },
                    reportModel,
                    nameSpace,
                    reviewTaskType,
                    target: targetId,
                },
                t
            );
            window.location.reload();
        } catch {
            setAssigning(false);
        }
    };

    return (
        <BannerStyled data-cy="copilotV2AssignmentBanner">
            <span className="banner-message">
                {t("copilotChatBot:unassignedBannerMessage")}
            </span>
            <button
                className="banner-button"
                onClick={handleAssign}
                disabled={assigning}
                data-cy="copilotV2AssignButton"
            >
                {t("copilotChatBot:assignToMyself")}
            </button>
        </BannerStyled>
    );
};

export default AssignmentBanner;
