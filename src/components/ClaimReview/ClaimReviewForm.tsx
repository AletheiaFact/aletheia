import Button, { ButtonType } from "../Button";
import { Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
    reviewingSelector,
    reviewDataSelector,
    reviewNotStartedSelector,
} from "../../machines/reviewTask/selectors";
import {
    currentUserId,
    currentUserRole,
    isUserLoggedIn,
} from "../../atoms/currentUser";

import DynamicReviewTaskForm from "./form/DynamicReviewTaskForm";
import { PlusOutlined } from "@ant-design/icons";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { Roles } from "../../types/enums";
import colors from "../../styles/colors";
import { useAtom } from "jotai";
import { useSelector } from "@xstate/react";
import { useTranslation } from "next-i18next";
import CopilotDrawer from "../Copilot/CopilotDrawer";
import { useAppSelector } from "../../store/store";
import { ReportModelEnum } from "../../machines/reviewTask/enums";

const ClaimReviewForm = ({
    claim,
    personalityId,
    dataHash,
    userIsReviewer,
    sentenceContent,
    componentStyle,
}) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [userId] = useAtom(currentUserId);
    const { machineService, reportModel, recreateMachine } = useContext(
        ReviewTaskMachineContext
    );
    const reviewData = useSelector(machineService, reviewDataSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isUnassigned = useSelector(machineService, reviewNotStartedSelector);
    const userIsAssignee = reviewData.usersId.includes(userId);
    const [formCollapsed, setFormCollapsed] = useState(
        isUnassigned && !reportModel
    );
    const userIsAdmin = role === Roles.Admin || role === Roles.SuperAdmin;
    const { enableCopilotChatBot, reviewDrawerCollapsed } = useAppSelector(
        (state) => ({
            enableCopilotChatBot: state?.enableCopilotChatBot,
            reviewDrawerCollapsed:
                state?.reviewDrawerCollapsed !== undefined
                    ? state?.reviewDrawerCollapsed
                    : true,
        })
    );

    const showForm =
        isUnassigned ||
        userIsAdmin ||
        (userIsAssignee && !isReviewing) ||
        (isReviewing && userIsReviewer);

    const toggleFormCollapse = (event) => {
        setFormCollapsed(!formCollapsed);
        recreateMachine(event.currentTarget.id);
    };

    useEffect(() => {
        setFormCollapsed(isUnassigned && !reportModel);
    }, [isUnassigned]);

    return (
        <Row
            style={{
                background: colors.lightGray,
                padding: "20px 15px",
            }}
        >
            <Col span={componentStyle.span} offset={componentStyle.offset}>
                {formCollapsed && (
                    <Row
                        style={{
                            width: "100%",
                            padding: "0px 0px 15px 0px",
                            justifyContent: "center",
                        }}
                    >
                        <Col
                            span={24}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: 16,
                            }}
                        >
                            {isLoggedIn && (
                                <Button
                                    type={ButtonType.blue}
                                    onClick={toggleFormCollapse}
                                    icon={<PlusOutlined />}
                                    data-cy={
                                        "testAddInformativeNewsReviewButton"
                                    }
                                    id={ReportModelEnum.InformativeNews}
                                >
                                    {t(
                                        "claimReviewForm:addInformativeNewsButton"
                                    )}
                                </Button>
                            )}
                            {isLoggedIn && (
                                <Button
                                    type={ButtonType.blue}
                                    onClick={toggleFormCollapse}
                                    icon={<PlusOutlined />}
                                    data-cy={"testAddFactCheckReviewButton"}
                                    id={ReportModelEnum.FactChecking}
                                >
                                    {t("claimReviewForm:addReviewButton")}
                                </Button>
                            )}
                        </Col>
                    </Row>
                )}
                <Col
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "0px 0px 15px 0px",
                    }}
                >
                    {!isLoggedIn && (
                        <Button href="/login">
                            {t("claimReviewForm:loginButton")}
                        </Button>
                    )}
                </Col>
                {!formCollapsed && showForm && (
                    <DynamicReviewTaskForm
                        data_hash={dataHash}
                        personality={personalityId}
                        claim={claim._id}
                    />
                )}
                {showForm && enableCopilotChatBot && reviewDrawerCollapsed && (
                    <CopilotDrawer claim={claim} sentence={sentenceContent} />
                )}
            </Col>
        </Row>
    );
};

export default ClaimReviewForm;
