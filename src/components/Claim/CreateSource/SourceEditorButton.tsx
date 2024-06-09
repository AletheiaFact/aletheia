import React, { useCallback, useState } from "react";
import AletheiaButton from "../../Button";
import { Col } from "antd";
import { URL_PATTERN } from "../../Collaborative/hooks/useFloatingLinkState";
import SummarizationApi from "../../../api/summarizationApi";
import colors from "../../../styles/colors";
import { useTranslation } from "next-i18next";

const SourceEditorButton = ({ manager, state }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const summarizeSource = useCallback(async () => {
        const [cardContent] = state.doc.content.toJSON();

        if (cardContent?.content) {
            const [content] = cardContent?.content;

            if (
                content.content &&
                URL_PATTERN.test(content?.content[0]?.text)
            ) {
                setIsLoading(true);
                const { output: summary } =
                    await SummarizationApi.summarizeSource(
                        content?.content[0]?.text
                    );
                setIsLoading(false);
                return manager.view.updateState(
                    manager.createState({
                        content: {
                            content: [
                                cardContent,
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
            }
        }
        setError(true);
    }, [manager, state.doc]);

    return (
        <Col
            span={24}
            style={{
                display: "flex",
                order: 1,
                flexDirection: "column",
                gap: 16,
            }}
        >
            {error && (
                <span style={{ color: colors.redText }}>
                    {t("sourceForm:errorMessageValidURL")}
                </span>
            )}
            <AletheiaButton
                onClick={summarizeSource}
                data-cy="testClaimReviewquestionsRemove1"
                style={{ width: "fit-content" }}
                loading={isLoading}
            >
                {t("sourceForm:summarizeSouce")}
            </AletheiaButton>
        </Col>
    );
};

export default SourceEditorButton;
