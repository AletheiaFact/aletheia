import {
    DOMCompatibleAttributes,
    ExtensionTag,
    NodeExtension,
    NodeExtensionSpec,
} from "@remirror/core";
import React, { ComponentType } from "react";
import { NodeViewComponentProps } from "@remirror/react";
import { SummaryCard } from "./SummaryCard";

class SummaryExtesion extends NodeExtension {
    get name() {
        return "summary" as const;
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({
        node,
        forwardRef,
    }) => {
        return <SummaryCard node={node} forwardRef={forwardRef} />;
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
                    "data-summary-id": node.attrs.summaryId,
                };
                return ["div", attrs, 0];
            },
            parseDOM: [
                {
                    attrs: {
                        summaryId: { default: "" },
                    },
                    tag: `div[data-summary-id]`,
                    getAttrs: (dom) => {
                        const node = dom as HTMLDivElement;
                        const summaryId = node.getAttribute("data-summary-id");

                        return {
                            summaryId,
                        };
                    },
                },
            ],
        };
    }
}

export default SummaryExtesion;
