import { Col, Row } from "antd";
import React, { useContext } from "react";
import Button, { ButtonType } from "../Button";
import {
    ReportModelEnum,
    ReviewTaskTypeEnum,
} from "../../machines/reviewTask/enums";
import { isUserLoggedIn } from "../../atoms/currentUser";
import { useAtom } from "jotai";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";

const ReportModelButtons = ({ setFormCollapsed }) => {
    const { t } = useTranslation();
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const { recreateMachine, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const isClaim = reviewTaskType === ReviewTaskTypeEnum.Claim;
    const isSource = reviewTaskType === ReviewTaskTypeEnum.Source;
    const isVerificationRequest =
        reviewTaskType === ReviewTaskTypeEnum.VerificationRequest;

    const toggleFormCollapse = (event) => {
        setFormCollapsed((prev) => !prev);
        recreateMachine(event.currentTarget.id);
    };

    return (
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
                    <>
                        {isClaim && (
                            <>
                                <Button
                                    buttonType={ButtonType.blue}
                                    onClick={toggleFormCollapse}
                                    startIcon={<PlusOutlined />}
                                    data-cy={
                                        "testAddInformativeNewsReviewButton"
                                    }
                                    id={ReportModelEnum.InformativeNews}
                                >
                                    {t(
                                        "claimReviewForm:addInformativeNewsButton"
                                    )}
                                </Button>
                                <Button
                                    buttonType={ButtonType.blue}
                                    onClick={toggleFormCollapse}
                                    startIcon={<PlusOutlined />}
                                    data-cy={"testAddFactCheckReviewButton"}
                                    id={ReportModelEnum.FactChecking}
                                >
                                    {t(
                                        "claimReviewForm:addFactCheckingReviewButton"
                                    )}
                                </Button>
                            </>
                        )}
                        {isSource && (
                            <Button
                            buttonType={ButtonType.blue}
                                onClick={toggleFormCollapse}
                                startIcon={<PlusOutlined />}
                                data-cy={"testAddFactCheckReviewButton"}
                                id={ReportModelEnum.FactChecking}
                            >
                                {t("claimReviewForm:addSourceReviewButton")}
                            </Button>
                        )}
                        {isVerificationRequest && (
                            <Button
                            buttonType={ButtonType.blue}
                                onClick={toggleFormCollapse}
                                startIcon={<PlusOutlined />}
                                data-cy={
                                    "testAddVerificationRequestReviewButton"
                                }
                                id={ReportModelEnum.Request}
                            >
                                {t(
                                    "claimReviewForm:addVerificationRequestButton"
                                )}
                            </Button>
                        )}
                    </>
                )}
            </Col>
        </Row>
    );
};

export default ReportModelButtons;
