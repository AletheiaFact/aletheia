import {
    DOMCompatibleAttributes,
    ExtensionTag,
    NodeExtension,
    NodeExtensionSpec,
} from "@remirror/core";
import React, { ComponentType } from "react";
import { NodeViewComponentProps } from "@remirror/react";
import { QuestionCard } from "./QuestionCard";

class QuestionExtension extends NodeExtension {
    get name() {
        return "questions" as const;
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({
        node,
        forwardRef,
    }) => {
        return <QuestionCard node={node} forwardRef={forwardRef} />;
    };

    createTags() {
        return [ExtensionTag.Block];
    }

    createNodeSpec(): NodeExtensionSpec {
        return {
            /**
             * FIXME: Draggable is not working currently, needs investigation
             */
            draggable: true,
            selectable: true,
            /**
             * Atom is needed to create a boundary between the card and
             * others elements in the editor
             */
            atom: true,
            /**
             * isolating is needed to not allow cards to get merged
             * whend deleting lines
             */
            isolating: true,
            content: "block*",
            toDOM: (node) => {
                const attrs: DOMCompatibleAttributes = {
                    "data-question-id": node.attrs.questionId,
                };
                return ["div", attrs, 0];
            },
            parseDOM: [
                {
                    attrs: {
                        questionId: { default: "" },
                    },
                    tag: `div[data-question-id]`,
                    getAttrs: (dom) => {
                        const node = dom as HTMLDivElement;
                        const questionId =
                            node.getAttribute("data-question-id");

                        return {
                            questionId,
                        };
                    },
                },
            ],
        };
    }
}

export default QuestionExtension;
