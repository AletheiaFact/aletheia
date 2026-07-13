import React, { useCallback, useContext, useState } from "react";
import AletheiaButton from "../../AletheiaButton";
import { Grid } from "@mui/material";
import SummarizationApi from "../../../api/summarizationApi";
import { VisualEditorContext } from "../VisualEditorProvider";
import { useTranslations } from "next-intl";

const SourceEditorButton = ({ manager, state, readonly }) => {
    const tSourceForm = useTranslations("sourceForm");
    const [isLoading, setIsLoading] = useState(false);
    const { source } = useContext(VisualEditorContext);

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
        <Grid
            container
            xs={12}
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
                {tSourceForm("summarizeSouce")}
            </AletheiaButton>
        </Grid>
    );
};

export default SourceEditorButton;
