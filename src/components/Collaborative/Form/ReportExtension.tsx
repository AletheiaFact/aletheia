import {
    DOMCompatibleAttributes,
    ExtensionTag,
    NodeExtension,
    NodeExtensionSpec,
} from "@remirror/core";
import React, { ComponentType } from "react";
import { NodeViewComponentProps } from "@remirror/react";
import { ReportCard } from "./ReportCard";

class ReportExtension extends NodeExtension {
    get name() {
        return "report" as const;
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({
        node,
        forwardRef,
    }) => {
        return <ReportCard node={node} forwardRef={forwardRef} />;
    };

    createTags() {
        return [ExtensionTag.Block];
    }
    createNodeSpec(): NodeExtensionSpec {
        return {
            selectable: false,
            /**
             * Atom is needed to create a boundary between the card and
             * others elements in the editor
             */
            atom: false,
            /**
             * isolating is needed to not allow cards to get deleted
             * whend deleting lines
             */
            isolating: true,
            content: "block*",
            toDOM: (node) => {
                const attrs: DOMCompatibleAttributes = {
                    "data-report-id": node.attrs.reportId,
                };
                return ["div", attrs, 0];
            },
            parseDOM: [
                {
                    attrs: {
                        reportId: { default: "" },
                    },
                    tag: `div[data-report-id]`,
                    getAttrs: (dom) => {
                        const node = dom as HTMLDivElement;
                        const reportId = node.getAttribute("data-report-id");

                        return {
                            reportId,
                        };
                    },
                },
            ],
        };
    }
}

export default ReportExtension;
