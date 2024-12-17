import React, { useCallback, useContext } from "react";
import { Grid } from "@mui/material";
import Button from "../../Button";
import { useCommands } from "@remirror/react";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { reviewingSelector } from "../../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";
import EditorCard from "./EditorCard";
import { uniqueId } from "remirror";

const QuestionCard = ({ forwardRef, node, initialPosition }) => {
    const { t } = useTranslation();
    const { machineService } = useContext(ReviewTaskMachineContext);
    const editable = useSelector(machineService, reviewingSelector);
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
                <Grid item xs={1}
                    style={{alignContent:"center"}}>
                    <Button
                        style={{ height: "40px", margin: "0 auto" }}
                        onClick={handleDelete}
                        disabled={editable}
                        data-cy="testClaimReviewquestionsRemove1"
                    >
                        <DeleteOutlined />
                    </Button>
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
