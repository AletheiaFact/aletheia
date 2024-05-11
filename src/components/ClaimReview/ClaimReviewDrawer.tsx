import {
    ArrowLeftOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
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
import { ContentModelEnum } from "../../types/enums";
import { CollaborativeEditorProvider } from "../Collaborative/CollaborativeEditorProvider";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import colors from "../../styles/colors";

const ClaimReviewDrawer = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [nameSpace] = useAtom(currentNameSpace);
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

    useEffect(() => setIsLoading(false), [claim, data_hash]);

    const isContentImage = claim?.contentModel === ContentModelEnum.Image;

    const getHref = () => {
        const hrefContent = isContentImage
            ? `/image/${data_hash}`
            : `/sentence/${data_hash}`;
        let href = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";
        if (personality) {
            href += `/personality/${personality.slug}/claim/${claim.slug}`;
        } else {
            href += `/claim/${claim?._id}`;
        }

        return `${href}${hrefContent}`;
    };

    return (
        <LargeDrawer
            open={!reviewDrawerCollapsed}
            onClose={() => dispatch(actions.closeReviewDrawer())}
        >
            {claim && data_hash && !isLoading ? (
                <ReviewTaskMachineProvider data_hash={data_hash}>
                    <CollaborativeEditorProvider data_hash={data_hash}>
                        <Row
                            justify="space-between"
                            style={{
                                width: "100%",
                                padding: "1rem",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Col style={{ display: "flex", gap: 32 }}>
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
                                <Col span={vw?.xs ? 8 : 14}>
                                    <AletheiaButton
                                        href={getHref()}
                                        onClick={() => setIsLoading(true)}
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
                            </Col>
                            <Col
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
                                        color: colors.blueSecondary,
                                        paddingBottom: 4,
                                    }}
                                />
                                <span
                                    style={{
                                        color: colors.blueSecondary,
                                        lineHeight: "16px",
                                    }}
                                >
                                    {t("copilotChatBot:copilotWarning")}
                                </span>
                            </Col>
                        </Row>
                        <ClaimReviewView
                            personality={personality}
                            claim={claim}
                            content={content}
                        />
                    </CollaborativeEditorProvider>
                </ReviewTaskMachineProvider>
            ) : (
                <Loading />
            )}
        </LargeDrawer>
    );
};

export default ClaimReviewDrawer;
