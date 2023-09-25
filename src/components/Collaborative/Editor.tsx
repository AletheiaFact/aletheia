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

/**
 * Modifies reference to useful properties those are easier to manipulate.
 * using useHelpers hook that only can be used inside a remirror component
 * @param state remirror state
 * @param editorRef reference to editor
 */
const Editor = ({ state }: { state: any }) => {
    const command = useCommands();
    const { setEditorContentObject, useCardPresence } = useContext(
        CollaborativeEditorContext
    );
    const { getJSON } = useHelpers();

    useEffect(
        () => setEditorContentObject(getJSON()),
        [state, getJSON, setEditorContentObject]
    );

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
            const endPosition = doc.content.size;
            command.insertHtml(insertNodeFunction(), {
                //TODO: investigate how to insert card on fixed positions
                selection: endPosition,
            });
            command.focus(endPosition);
        },
        [command, state]
    );

    return (
        <EditorStyle>
            <div className="toolbar">
                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getSummaryContentHtml)}
                    disabled={summaryDisabled}
                >
                    <SummarizeIcon className="toolbar-item-icon" />
                </Button>

                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getQuestionContentHtml)}
                >
                    <QuestionMarkIcon className="toolbar-item-icon" />
                </Button>

                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getReportContentHtml)}
                    disabled={reportDisabled}
                >
                    <ReportProblemIcon className="toolbar-item-icon" />
                </Button>

                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getVerificationContentHtml)}
                    disabled={verificationDisabled}
                >
                    <FactCheckIcon className="toolbar-item-icon" />
                </Button>
            </div>
        </EditorStyle>
    );
};

export default Editor;
