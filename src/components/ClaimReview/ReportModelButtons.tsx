import { Grid } from "@mui/material";
import React, { useContext } from "react";
import Button, { ButtonType } from "../Button";
import {
    ReportModelEnum,
    ReviewTaskTypeEnum,
} from "../../machines/reviewTask/enums";
import { isUserLoggedIn } from "../../atoms/currentUser";
import { useAtom } from "jotai";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import AddIcon from "@mui/icons-material/Add";
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
        <Grid
            container
            style={{
                width: "100%",
                padding: "0px 0px 15px 0px",
                justifyContent: "center",
            }}
        >
            <Grid
                item
                xs={12}
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
                                    type={ButtonType.blue}
                                    onClick={toggleFormCollapse}
                                    icon={<AddIcon />}
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
                                    type={ButtonType.blue}
                                    onClick={toggleFormCollapse}
                                    icon={<AddIcon />}
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
                                type={ButtonType.blue}
                                onClick={toggleFormCollapse}
                                icon={<AddIcon />}
                                data-cy={"testAddFactCheckReviewButton"}
                                id={ReportModelEnum.FactChecking}
                            >
                                {t("claimReviewForm:addSourceReviewButton")}
                            </Button>
                        )}
                        {isVerificationRequest && (
                            <Button
                                type={ButtonType.blue}
                                onClick={toggleFormCollapse}
                                icon={<AddIcon />}
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
            </Grid>
        </Grid>
    );
};

export default ReportModelButtons;
