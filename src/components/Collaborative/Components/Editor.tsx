import React, { useCallback, useContext } from "react";

import { useHelpers, useCommands } from "@remirror/react";
import {
    Summarize,
    QuestionMark,
    ReportProblem,
    FactCheck
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import EditorStyle from "./Editor.style";
import useCardPresence from "../hooks/useCardPresence";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import {
    ReportModelEnum,
    ReviewTaskTypeEnum,
} from "../../../machines/reviewTask/enums";
import { getContentHtml } from "../Form/EditorCard";
import { EditorState } from "remirror";

/**
 * @param editable enable or disable buttons
 * @param state remirror state
 * @returns An toolbar used for users to add a new input.
 */
const Editor = ({
    editable,
    state,
}: {
    editable: boolean;
    state: EditorState;
}) => {
    const command = useCommands();
    const { reportModel, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const { getJSON } = useHelpers();

    const summaryDisabled = useCardPresence(getJSON, state, "summary", false);
    const reportDisabled = useCardPresence(getJSON, state, "report", false);
    const verificationDisabled = useCardPresence(
        getJSON,
        state,
        "verification",
        false
    );

    const handleInsertNode = useCallback(
        (insertNode) => {
            const { doc } = state;
            command.insertHtml(insertNode, {
                selection: doc.content.size,
                replaceEmptyParentBlock: true,
            });
        },
        [command, state]
    );

    const actions = [
        {
            onClick: () => handleInsertNode(getContentHtml("data-summary-id")),
            disabled: editable || summaryDisabled,
            "data-cy": "testClaimReviewsummarizeAdd",
            icon: <Summarize className="toolbar-item-icon" />,
        },
    ];

    if (reportModel === ReportModelEnum.FactChecking) {
        actions.push(
            {
                onClick: () =>
                    handleInsertNode(getContentHtml("data-verification-id")),
                disabled: editable || verificationDisabled,
                "data-cy": "testClaimReviewverificationAdd",
                icon: <FactCheck className="toolbar-item-icon" />,
            },
            {
                onClick: () =>
                    handleInsertNode(getContentHtml("data-report-id")),
                disabled: editable || reportDisabled,
                "data-cy": "testClaimReviewreportAdd",
                icon: <ReportProblem className="toolbar-item-icon" />,
            },
            {
                onClick: () =>
                    handleInsertNode(getContentHtml("data-question-id")),
                disabled: editable,
                "data-cy": "testClaimReviewquestionsAdd",
                icon: <QuestionMark className="toolbar-item-icon" />,
            }
        );
    }

    if (reviewTaskType !== ReviewTaskTypeEnum.Claim) {
        return <></>;
    }

    return (
        <EditorStyle>
            <div className="toolbar">
                {actions ? (
                    actions.map(({ icon, ...props }) => (
                        <IconButton
                            key={props["data-cy"]}
                            className="toolbar-item"
                            style={{ outline: "none", border: "none" }}
                            {...props}
                        >
                            {icon}
                        </IconButton>
                    ))
                ) : (
                    <></>
                )}
            </div>
        </EditorStyle>
    );
};

export default Editor;
