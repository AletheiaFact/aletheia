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
import AgentReviewModal from "../Modal/AgentReviewModal";
import CopilotDrawer from "../Copilot/CopilotDrawer";

const ClaimReviewForm = ({
    claimId,
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
    const { machineService } = useContext(ReviewTaskMachineContext);
    const reviewData = useSelector(machineService, reviewDataSelector);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isUnassigned = useSelector(machineService, reviewNotStartedSelector);
    const userIsAssignee = reviewData.usersId.includes(userId);
    const [formCollapsed, setFormCollapsed] = useState(isUnassigned);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const userIsAdmin = role === Roles.Admin || Roles.SuperAdmin;

    const showForm =
        isUnassigned ||
        userIsAdmin ||
        (userIsAssignee && !isReviewing) ||
        (isReviewing && userIsReviewer);

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
            <Col span={componentStyle.span} offset={componentStyle.offset}>
                {formCollapsed && (
                    <Row
                        style={{
                            width: "100%",
                            padding: "0px 0px 15px 0px",
                            justifyContent: "center",
                        }}
                    >
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
                <CopilotDrawer sentence={sentenceContent} />
            </Col>

            <AgentReviewModal
                sentence={sentenceContent}
                visible={isModalVisible}
                handleCancel={() => setIsModalVisible(false)}
                claimId={claimId}
                personalityId={personalityId}
                dataHash={dataHash}
            />
        </Row>
    );
};

export default ClaimReviewForm;
