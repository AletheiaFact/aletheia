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
import { ContentModelEnum } from "../../types/enums";

const ClaimReviewDrawer = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const {
        reviewDrawerCollapsed,
        vw,
        personality,
        claim,
        content,
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
            content: state?.selectedContent,
            data_hash: state?.selectedDataHash,
        };
    });
    const isContentImage = claim?.contentModel === ContentModelEnum.Image;

    let href = personality
        ? `/personality/${personality?.slug}/claim/${claim?.slug}`
        : `/claim`;
    href += isContentImage ? `/${claim?._id}` : `/sentence/${data_hash}`;
    // TODO: como fazer pagina de review da imagem sendo que o link é o mesmo da imagem como claim?

    return (
        <LargeDrawer
            visible={!reviewDrawerCollapsed}
            onClose={() => dispatch(actions.closeReviewDrawer())}
        >
            {claim && data_hash ? (
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
                        content={content}
                    />
                </ReviewTaskMachineProvider>
            ) : (
                <Loading />
            )}
        </LargeDrawer>
    );
};

export default ClaimReviewDrawer;
