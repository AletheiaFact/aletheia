import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Drawer, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import { GlobalStateMachineProvider } from "../../Context/GlobalStateMachineProvider";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaButton, { ButtonType } from "../Button";

import ClaimReviewView, { ClaimReviewViewProps } from "./ClaimReviewView";

const ClaimReviewDrawer = (props: Partial<ClaimReviewViewProps>) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { reviewDrawerCollapsed, vw, personality, claim } =
        useAppSelector((state) => {
            return {
                reviewDrawerCollapsed:
                    state?.reviewDrawerCollapsed !== undefined
                        ? state?.reviewDrawerCollapsed
                        : true,
                vw: state?.vw,
                personality: state?.selectedPersonality,
                claim: state?.selectedClaim,
                sentence: state?.selectedSentence,
            };
        });

    const href = `/personality/${personality.slug}/claim/${claim.slug}/sentence/${props.sentence?.data_hash}`;

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
            <GlobalStateMachineProvider data_hash={props.sentence?.data_hash}>
                <Row
                    justify="space-between"
                    style={{ width: vw?.sm ? "100%" : "55%", padding: "1rem" }}
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
                <ClaimReviewView personality={personality} claim={claim} sentence={props.sentence} {...props} />
            </GlobalStateMachineProvider>
        </Drawer>
    );
};

export default ClaimReviewDrawer;
