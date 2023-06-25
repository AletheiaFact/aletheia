import { useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import { PlusOutlined } from "@ant-design/icons";
import DynamicReviewTaskForm from "./form/DynamicReviewTaskForm";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import {
    publishedSelector,
    crossCheckingSelector,
    reviewNotStartedSelector,
    reviewDataSelector,
} from "../../machines/reviewTask/selectors";
import { Roles } from "../../types/enums";
import { useAtom } from "jotai";
import {
    currentUserRole,
    isUserLoggedIn,
    currentUserId,
} from "../../atoms/currentUser";

const ClaimReviewForm = ({
    claimId,
    personalityId,
    dataHash,
    userIsReviewer,
}) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const [userId] = useAtom(currentUserId);

    const { machineService } = useContext(ReviewTaskMachineContext);

    const reviewData = useSelector(machineService, reviewDataSelector);
    const isPublished = useSelector(machineService, publishedSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isUnassigned = useSelector(machineService, reviewNotStartedSelector);
    const userIsAssignee = reviewData.usersId.includes(userId);
    const [formCollapsed, setFormCollapsed] = useState(isUnassigned);
    const userIsAdmin = role === Roles.Admin;

    const showForm =
        isUnassigned ||
        userIsAdmin ||
        (userIsAssignee && !isCrossChecking) ||
        (isCrossChecking && userIsReviewer);

    const toggleFormCollapse = () => {
        setFormCollapsed(!formCollapsed);
    };

    useEffect(() => {
        setFormCollapsed(isUnassigned);
    }, [isUnassigned]);

    return (
        !isPublished && (
            <Col
                offset={3}
                span={18}
                style={{
                    background: colors.lightGray,
                    padding: "20px 15px",
                }}
            >
                {formCollapsed && (
                    <Row
                        style={{
                            width: "100%",
                            padding: "0px 0px 15px 0px",
                            justifyContent: "center",
                        }}
                    >
                        <>
                            {isLoggedIn && (
                                <Button
                                    type={ButtonType.blue}
                                    onClick={toggleFormCollapse}
                                    icon={<PlusOutlined />}
                                    data-cy={"testAddReviewButton"}
                                >
                                    {t("claimReviewForm:addReviewButton")}
                                </Button>
                            )}
                        </>
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
                        claim={claimId}
                    />
                )}
            </Col>
        )
    );
};

export default ClaimReviewForm;
