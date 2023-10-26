import { ArrowLeftOutlined } from "@ant-design/icons";
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

    let href =
        nameSpace !== NameSpaceEnum.Main
            ? `/${nameSpace}/claim/${claim?._id}`
            : `/claim/${claim?._id}`;

    if (personality) {
        href =
            nameSpace !== NameSpaceEnum.Main
                ? `${nameSpace}/personality/${personality?.slug}/claim/${claim?.slug}`
                : `/personality/${personality?.slug}/claim/${claim?.slug}`;
    }

    href += isContentImage ? `/image/${data_hash}` : `/sentence/${data_hash}`;

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
