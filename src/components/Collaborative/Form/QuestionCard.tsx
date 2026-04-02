import React, { useCallback, useContext } from "react";
import { Grid, Tooltip } from "@mui/material";
import Button from "../../Button";
import { useCommands } from "@remirror/react";
import { DeleteOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import EditorCard from "./EditorCard";
import { uniqueId } from "remirror";
import { VisualEditorContext } from "../VisualEditorProvider";

const QuestionCard = ({ forwardRef, node, initialPosition }) => {
    const { t } = useTranslation();
    const { editorConfiguration } = useContext(VisualEditorContext);
    const command = useCommands();

    const handleDelete = useCallback(
        () =>
            command.delete({
                from: initialPosition,
                to: initialPosition + node.nodeSize,
            }),
        [command, initialPosition, node.nodeSize]
    );

    return (
        <EditorCard
            label={t("claimReviewForm:questionsLabel")}
            dataCy="testClaimReviewquestions0"
            span={11}
            forwardRef={forwardRef}
            inputSize={40}
            extra={
                <Grid item xs={1} style={{ alignContent: "center" }}>
                    <Tooltip
                        title={
                            editorConfiguration?.readonly
                                ? t("claimReviewForm:viewOnlyTooltip")
                                : ""
                        }
                        arrow
                    >
                        <span>
                            <Button
                                style={{
                                    height: "40px",
                                    margin: "0 auto",
                                    opacity: editorConfiguration?.readonly
                                        ? 0.4
                                        : 1,
                                    cursor: editorConfiguration?.readonly
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                                onClick={handleDelete}
                                disabled={editorConfiguration?.readonly}
                                data-cy="testClaimReviewquestionsRemove1"
                                contentEditable={false}
                                suppressContentEditableWarning
                            >
                                <DeleteOutlined fontSize="small" />
                            </Button>
                        </span>
                    </Tooltip>
                </Grid>
            }
        />
    );
};

export const getQuestionContentHtml = () => `
    <div data-question-id="${uniqueId()}">
        <p></p>
    </div>`;

export default QuestionCard;
