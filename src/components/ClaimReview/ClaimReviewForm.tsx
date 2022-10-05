import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import Button, { ButtonType } from "../Button";
import { PlusOutlined } from "@ant-design/icons";
import DynamicForm from "./form/DynamicForm";
import { useAppSelector } from "../../store/store";
import { ReviewTaskMachineContext } from "../../Context/ReviewTaskMachineProvider";
import {
    publishedSelector,
    crossCheckingSelector,
    reviewStartedSelector,
    reviewDataSelector,
} from "../../machines/reviewTask/selectors";

const ClaimReviewForm = ({
    claimId,
    personalityId,
    sentenceHash,
    sitekey,
    userIsReviewer,
    userId,
}) => {
    const { t } = useTranslation();
    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state.login,
    }));

    const { machineService } = useContext(ReviewTaskMachineContext);

    const reviewData = useSelector(machineService, reviewDataSelector);
    const isPublished = useSelector(machineService, publishedSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isStarted = useSelector(machineService, reviewStartedSelector);
    const userIsAssignee = reviewData.usersId.includes(userId);

    const [formCollapsed, setFormCollapsed] = useState(isStarted);

    const showForm =
        isStarted ||
        (userIsAssignee && !isCrossChecking) ||
        (isCrossChecking && userIsReviewer);

    const toggleFormCollapse = () => {
        setFormCollapsed(!formCollapsed);
    };

    return (
        !isPublished && (
            <Col
                offset={3}
                span={18}
                style={{
                    background: colors.lightGray,
                    padding: "20px 15px",
                    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.15)",
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
                    <DynamicForm
                        sentence_hash={sentenceHash}
                        personality={personalityId}
                        claim={claimId}
                        sitekey={sitekey}
                    />
                )}
            </Col>
        )
    );
};

export default ClaimReviewForm;
