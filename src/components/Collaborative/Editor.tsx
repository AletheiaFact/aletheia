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
 * Modifies context state to JSON using useHelpers hook
 * which can only be used inside a remirror component.
 * Also returns a inputs toolbar which can be used for users
 * to add a new input.
 * @param state remirror state
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
        (insertNodeFunction, fixedPosition) => {
            const { doc } = state;
            const { node, selection } = identifyPosition(
                doc.content,
                fixedPosition
            );

            const insertTopLevelNode = (content, selection, node) => {
                command.focus(selection);
                if (selection !== content.size && selection !== 0) {
                    command.insertParagraph(" ", { selection });
                    command.insertNode(node, { selection });
                }
            };

            insertTopLevelNode(doc.content, selection, node);
            command.insertHtml(insertNodeFunction(), {
                selection,
                replaceEmptyParentBlock: selection !== 0,
            });
        },
        [command, state]
    );

    const identifyPosition = (nodes, fixedPosition) => {
        const target = [0, "verification", "summary", -1];
        let selection = 0;
        let node = null;

        for (let i = 0; i < nodes.childCount; i++) {
            const childNode = nodes.child(i);

            if (target[fixedPosition] === 0) break;
            else if (target[fixedPosition] === -1) {
                selection = nodes.size;
                break;
            }

            if (childNode.type.name === target[fixedPosition]) {
                node = childNode;
                break;
            }
            selection += childNode.nodeSize;
        }

        return {
            node,
            selection,
        };
    };

    return (
        <EditorStyle>
            <div className="toolbar">
                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getQuestionContentHtml, 0)}
                >
                    <QuestionMarkIcon className="toolbar-item-icon" />
                </Button>

                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getReportContentHtml, 1)}
                    disabled={reportDisabled}
                >
                    <ReportProblemIcon className="toolbar-item-icon" />
                </Button>

                <Button
                    className="toolbar-item"
                    onClick={() =>
                        handleInsertNode(getVerificationContentHtml, 2)
                    }
                    disabled={verificationDisabled}
                >
                    <FactCheckIcon className="toolbar-item-icon" />
                </Button>

                <Button
                    className="toolbar-item"
                    onClick={() => handleInsertNode(getSummaryContentHtml, 3)}
                    disabled={summaryDisabled}
                >
                    <SummarizeIcon className="toolbar-item-icon" />
                </Button>
            </div>
        </EditorStyle>
    );
};

export default Editor;
