import { Grid } from "@mui/material";
import React, { useContext } from "react";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import {
    ReportModelEnum,
    ReviewTaskTypeEnum,
} from "../../machines/reviewTask/enums";
import { currentUserRole } from "../../atoms/currentUser";
import { isStaff } from "../../utils/GetUserPermission";
import { useAtom } from "jotai";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "next-i18next";

const ReportModelButtons = ({ setFormCollapsed }) => {
    const { t } = useTranslation();
    const [role] = useAtom(currentUserRole);
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
                {isStaff(role) && (
                    <>
                        {isClaim && (
                            <>
                                <AletheiaButton
                                    type={ButtonType.primary}
                                    onClick={toggleFormCollapse}
                                    data-cy={
                                        "testAddInformativeNewsReviewButton"
                                    }
                                    id={ReportModelEnum.InformativeNews}
                                    startIcon={<AddIcon />}
                                >
                                    {t(
                                        "claimReviewForm:addInformativeNewsButton"
                                    )}
                                </AletheiaButton>
                                <AletheiaButton
                                    type={ButtonType.primary}
                                    onClick={toggleFormCollapse}
                                    data-cy={"testAddFactCheckReviewButton"}
                                    id={ReportModelEnum.FactChecking}
                                    startIcon={<AddIcon />}
                                >
                                    {t(
                                        "claimReviewForm:addFactCheckingReviewButton"
                                    )}
                                </AletheiaButton>
                            </>
                        )}
                        {isSource && (
                            <AletheiaButton
                                type={ButtonType.primary}
                                onClick={toggleFormCollapse}
                                data-cy={"testAddFactCheckReviewButton"}
                                id={ReportModelEnum.FactChecking}
                                startIcon={<AddIcon />}
                            >
                                {t("claimReviewForm:addSourceReviewButton")}
                            </AletheiaButton>
                        )}
                        {isVerificationRequest && (
                            <AletheiaButton
                                type={ButtonType.primary}
                                onClick={toggleFormCollapse}
                                data-cy={
                                    "testAddVerificationRequestReviewButton"
                                }
                                id={ReportModelEnum.Request}
                                startIcon={<AddIcon />}
                            >
                                {t(
                                    "claimReviewForm:addVerificationRequestButton"
                                )}
                            </AletheiaButton>
                        )}
                    </>
                )}
            </Grid>
        </Grid>
    );
};

export default ReportModelButtons;
