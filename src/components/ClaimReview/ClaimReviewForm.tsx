import Button, { ButtonType } from "../Button";
import { Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
    crossCheckingSelector,
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
        <Row
            style={{
                background: colors.lightGray,
                padding: "20px 15px",
            }}
        >
            <Col offset={3} span={18}>
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
        </Row>
    );
};

export default ClaimReviewForm;
