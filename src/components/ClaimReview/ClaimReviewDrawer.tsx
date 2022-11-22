import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import { ReviewTaskMachineProvider } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import AletheiaButton, { ButtonType } from "../Button";

import ClaimReviewView from "./ClaimReviewView";
import Loading from "../Loading";
import LargeDrawer from "../LargeDrawer";

const ClaimReviewDrawer = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const {
        reviewDrawerCollapsed,
        vw,
        personality,
        claim,
        sentence,
        data_hash,
    } = useAppSelector((state) => {
        return {
            reviewDrawerCollapsed:
                state?.reviewDrawerCollapsed !== undefined
                    ? state?.reviewDrawerCollapsed
                    : true,
            vw: state?.vw,
            personality: state?.selectedPersonality,
            claim: state?.selectedClaim,
            sentence: state?.selectedSentence,
            data_hash: state?.selectedDataHash,
        };
    });

    const href = `/personality/${personality?.slug}/claim/${claim?.slug}/sentence/${data_hash}`;

    return (
        <LargeDrawer
            visible={!reviewDrawerCollapsed}
            onClose={() => dispatch(actions.closeReviewDrawer())}
        >
            {personality && claim && sentence && data_hash ? (
                <ReviewTaskMachineProvider data_hash={data_hash}>
                    <Row
                        justify="space-between"
                        style={{
                            width: vw?.sm ? "100%" : "55%",
                            padding: "1rem",
                        }}
                    >
                        <Col>
                            <AletheiaButton
                                icon={<ArrowLeftOutlined />}
                                onClick={() =>
                                    dispatch(actions.closeReviewDrawer())
                                }
                                type={ButtonType.gray}
                                data-cy="testCloseReviewDrawer"
                            >
                                {t("common:back_button")}
                            </AletheiaButton>
                        </Col>
                        <Col>
                            <AletheiaButton
                                href={href}
                                type={ButtonType.gray}
                                style={{
                                    textDecoration: "underline",
                                    fontWeight: "bold",
                                }}
                                data-cy="testSeeFullReview"
                            >
                                {t("claimReviewTask:seeFullPage")}
                            </AletheiaButton>
                        </Col>
                    </Row>
                    <ClaimReviewView
                        personality={personality}
                        claim={claim}
                        sentence={sentence}
                    />
                </ReviewTaskMachineProvider>
            ) : (
                <Loading />
            )}
        </LargeDrawer>
    );
};

export default ClaimReviewDrawer;
