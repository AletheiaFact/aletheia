import {
    ArrowLeftOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Grid } from "@mui/material"
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReviewTaskMachineProvider } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import AletheiaButton, { ButtonType } from "../Button";

import ClaimReviewView from "./ClaimReviewView";
import Loading from "../Loading";
import LargeDrawer from "../LargeDrawer";
import { VisualEditorProvider } from "../Collaborative/VisualEditorProvider";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import colors from "../../styles/colors";
import { generateReviewContentPath } from "../../utils/GetReviewContentHref";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";

const ClaimReviewDrawer = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [nameSpace] = useAtom(currentNameSpace);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const {
        reviewDrawerCollapsed,
        vw,
        personality,
        target,
        content,
        data_hash,
        enableCopilotChatBot,
    } = useAppSelector((state) => ({
        reviewDrawerCollapsed:
            state?.reviewDrawerCollapsed !== undefined
                ? state?.reviewDrawerCollapsed
                : true,
        vw: state?.vw,
        personality: state?.selectedPersonality,
        target: state?.selectedTarget,
        content: state?.selectedContent,
        data_hash: state?.selectedDataHash,
        enableCopilotChatBot: state?.enableCopilotChatBot,
    }));

    useEffect(() => setIsLoading(false), [target, data_hash]);

    return (
        <LargeDrawer
            open={!reviewDrawerCollapsed}
            onClose={() => dispatch(actions.closeReviewDrawer())}
        >
            {target && data_hash && !isLoading ? (
                <ReviewTaskMachineProvider
                    data_hash={data_hash}
                    reviewTaskType={
                        content?.reviewTaskType || ReviewTaskTypeEnum.Claim
                    }
                >
                    <VisualEditorProvider data_hash={data_hash}>
                        <Grid container
                            style={{
                                width: "100%",
                                padding: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent:"space-between"
                            }}
                        >
                            <Grid item style={{ display: "flex", gap: 32 }}>
                                <AletheiaButton
                                    startIcon={<ArrowLeftOutlined />}
                                    onClick={() =>
                                        dispatch(actions.closeReviewDrawer())
                                    }
                                    buttonType={ButtonType.gray}
                                    data-cy="testCloseReviewDrawer"
                                >
                                    {t("common:back_button")}
                                </AletheiaButton>
                                <Grid item xs={vw?.xs ? 4 : 7}>
                                    <AletheiaButton
                                        href={generateReviewContentPath(
                                            nameSpace,
                                            personality,
                                            target,
                                            target?.contentModel,
                                            data_hash,
                                            content?.reviewTaskType
                                        )}
                                        onClick={() => setIsLoading(true)}
                                        buttonType={ButtonType.gray}
                                        style={{
                                            textDecoration: "underline",
                                            fontWeight: "bold",
                                        }}
                                        data-cy="testSeeFullReview"
                                    >
                                        {t("reviewTask:seeFullPage")}
                                    </AletheiaButton>
                                </Grid>
                            </Grid>
                            {enableCopilotChatBot && (
                                <Grid item
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 8,
                                        alignItems: "center",
                                    }}
                                >
                                    <ExclamationCircleOutlined
                                        style={{
                                            fontSize: 16,
                                            color: colors.secondary,
                                            paddingBottom: 4,
                                        }}
                                    />
                                    <span
                                        style={{
                                            color: colors.secondary,
                                            lineHeight: "16px",
                                        }}
                                    >
                                        {t("copilotChatBot:copilotWarning")}
                                    </span>
                                </Grid>
                            )}
                        </Grid>
                        <ClaimReviewView
                            personality={personality}
                            target={target}
                            content={content}
                        />
                    </VisualEditorProvider>
                </ReviewTaskMachineProvider>
            ) : (
                <Loading />
            )}
        </LargeDrawer>
    );
};

export default ClaimReviewDrawer;
