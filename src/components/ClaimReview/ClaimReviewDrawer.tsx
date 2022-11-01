import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Drawer, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import { ReviewTaskMachineProvider } from "../../Context/ReviewTaskMachineProvider";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";

import ClaimReviewView from "./ClaimReviewView";
import Loading from "../Loading";

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
        <Drawer
            visible={!reviewDrawerCollapsed}
            onClose={() => dispatch(actions.closeReviewDrawer())}
            width={vw?.sm ? "100%" : "60%"}
            height={vw?.sm ? "85%" : "100%"}
            placement={vw?.sm ? "bottom" : "right"}
            bodyStyle={{ padding: 0 }}
            drawerStyle={{
                backgroundColor: colors.lightGray,
            }}
            closable={false}
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
        </Drawer>
    );
};

export default ClaimReviewDrawer;
