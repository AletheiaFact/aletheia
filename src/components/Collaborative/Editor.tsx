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

    return (
        <EditorStyle>
            <div className="toolbar">
                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getQuestionContentHtml)}
                    disabled={editable}
                    style={{ outline: "none", border: "none" }}
                    data-cy="testClaimReviewquestionsAdd"
                >
                    <QuestionMarkIcon className="toolbar-item-icon" />
                </Button>

                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getSummaryContentHtml)}
                    disabled={editable || summaryDisabled}
                    style={{ outline: "none", border: "none" }}
                    data-cy="testClaimReviewsummarizeAdd"
                >
                    <SummarizeIcon className="toolbar-item-icon" />
                </Button>

                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getReportContentHtml)}
                    disabled={editable || reportDisabled}
                    style={{ outline: "none", border: "none" }}
                    data-cy="testClaimReviewreportAdd"
                >
                    <ReportProblemIcon className="toolbar-item-icon" />
                </Button>

                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getVerificationContentHtml)}
                    disabled={editable || verificationDisabled}
                    style={{ outline: "none", border: "none" }}
                    data-cy="testClaimReviewverificationAdd"
                >
                    <FactCheckIcon className="toolbar-item-icon" />
                </Button>
            </div>
        </EditorStyle>
    );
};

export default Editor;
