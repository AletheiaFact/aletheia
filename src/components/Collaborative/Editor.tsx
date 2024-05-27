import React, { useEffect, useCallback, useContext } from "react";

import { useHelpers } from "@remirror/react";
import { useCommands } from "@remirror/react";
import { getSummaryContentHtml } from "./Form/SummaryCard";
import { getQuestionContentHtml } from "./Form/QuestionCard";
import { getReportContentHtml } from "./Form/ReportCard";
import { getVerificationContentHtml } from "./Form/VerificationCard";
import SummarizeIcon from "@mui/icons-material/Summarize";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { Button } from "antd";
import EditorStyle from "./Editor.style";
import { CollaborativeEditorContext } from "./CollaborativeEditorProvider";
import useCardPresence from "./hooks/useCardPresence";
import { Node } from "@remirror/pm/model";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { ReportModelEnum } from "../../machines/reviewTask/enums";

/**
 * Modifies context state to JSON using useHelpers hook
 * which can only be used inside a remirror component.
 * Also returns a inputs toolbar which can be used for users
 * to add a new input.
 * @param state remirror state
 */
const Editor = ({
    node,
    editable,
    state,
}: {
    node: Node;
    editable: boolean;
    state: any;
}) => {
    const command = useCommands();
    const {
        setEditorContentObject,
        shouldInsertAIReport,
        setShouldInsertAIReport,
    } = useContext(CollaborativeEditorContext);
    const { reportModel } = useContext(ReviewTaskMachineContext);
    const { getJSON } = useHelpers();

    useEffect(
        () => setEditorContentObject(getJSON()),
        [state, getJSON, setEditorContentObject]
    );

    /**
     * Deletes current report and insert automated fact-checking generated report.
     * This solution is need because when we try to update the editorContentObject react state, the remirror state overrides the changes, not applying the generated report into the document.
     */
    useEffect(() => {
        if (shouldInsertAIReport) {
            command.delete({ from: 0, to: state.doc.content.size });
            command.insertNode(node);
        }
        setShouldInsertAIReport(false);
    }, [shouldInsertAIReport]);

    const summaryDisabled = useCardPresence(getJSON, state, "summary", false);
    const reportDisabled = useCardPresence(getJSON, state, "report", false);
    const verificationDisabled = useCardPresence(
        getJSON,
        state,
        "verification",
        false
    );

    const handleInsertNode = useCallback(
        (insertNodeFunction) => {
            const { doc } = state;
            command.insertHtml(insertNodeFunction(), {
                selection: doc.content.size,
                replaceEmptyParentBlock: true,
            });
        },
        [command, state]
    );

    const actions = [
        {
            onClick: () => handleInsertNode(getSummaryContentHtml),
            disabled: editable || summaryDisabled,
            "data-cy": "testClaimReviewsummarizeAdd",
            icon: <SummarizeIcon className="toolbar-item-icon" />,
        },
    ];

    if (reportModel === ReportModelEnum.FactChecking) {
        actions.push(
            {
                onClick: () => handleInsertNode(getVerificationContentHtml),
                disabled: editable || verificationDisabled,
                "data-cy": "testClaimReviewverificationAdd",
                icon: <FactCheckIcon className="toolbar-item-icon" />,
            },
            {
                onClick: () => handleInsertNode(getReportContentHtml),
                disabled: editable || reportDisabled,
                "data-cy": "testClaimReviewreportAdd",
                icon: <ReportProblemIcon className="toolbar-item-icon" />,
            },
            {
                onClick: () => handleInsertNode(getQuestionContentHtml),
                disabled: editable,
                "data-cy": "testClaimReviewquestionsAdd",
                icon: <QuestionMarkIcon className="toolbar-item-icon" />,
            }
        );
    }

    return (
        <EditorStyle>
            <div className="toolbar">
                {actions ? (
                    actions.map(({ icon, ...props }) => (
                        <Button
                            key={props["data-cy"]}
                            className="toolbar-item"
                            style={{ outline: "none", border: "none" }}
                            {...props}
                        >
                            {icon}
                        </Button>
                    ))
                ) : (
                    <></>
                )}
            </div>
        </EditorStyle>
    );
};

export default Editor;
