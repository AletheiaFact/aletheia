import React, { useCallback, useContext, useState } from "react";
import AletheiaButton from "../../Button";
import { Col } from "antd";
import SummarizationApi from "../../../api/summarizationApi";
import { useTranslation } from "next-i18next";
import { CollaborativeEditorContext } from "../../Collaborative/CollaborativeEditorProvider";

const SourceEditorButton = ({ manager, state, readonly }) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { source } = useContext(CollaborativeEditorContext);

    const summarizeSource = useCallback(async () => {
        setIsLoading(true);
        const { output: summary } = await SummarizationApi.summarizeSource(
            source
        );
        setIsLoading(false);
        return manager.view.updateState(
            manager.createState({
                content: {
                    content: [
                        {
                            type: "summary",
                            content: [
                                {
                                    type: "paragraph",
                                    content: [
                                        {
                                            type: "text",
                                            text: summary,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    type: "doc",
                },
            })
        );
    }, [manager, state.doc]);

    return (
        <Col
            span={24}
            style={{
                display: "flex",
                order: 4,
                flexDirection: "column",
                gap: 16,
                marginBottom: 32,
            }}
        >
            <AletheiaButton
                onClick={summarizeSource}
                data-cy="testClaimReviewquestionsRemove1"
                style={{ width: "fit-content" }}
                loading={isLoading}
                disabled={readonly}
            >
                {t("sourceForm:summarizeSouce")}
            </AletheiaButton>
        </Col>
    );
};

export default SourceEditorButton;
