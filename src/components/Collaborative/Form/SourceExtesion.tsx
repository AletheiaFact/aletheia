import {
    DOMCompatibleAttributes,
    ExtensionTag,
    NodeExtension,
    NodeExtensionSpec,
} from "@remirror/core";
import React, { ComponentType } from "react";
import { NodeViewComponentProps } from "@remirror/react";
import { SourceCard } from "./SourceCard";

class SourceExtension extends NodeExtension {
    get name() {
        return "source" as const;
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({
        forwardRef,
    }) => {
        return <SourceCard forwardRef={forwardRef} />;
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
                    "data-source-id": node.attrs.sourceId,
                };
                return ["div", attrs, 0];
            },
            parseDOM: [
                {
                    attrs: {
                        sourceId: { default: "" },
                    },
                    tag: `div[data-source-id]`,
                    getAttrs: (dom) => {
                        const node = dom as HTMLDivElement;
                        const sourceId = node.getAttribute("data-source-id");

                        return {
                            sourceId,
                        };
                    },
                },
            ],
        };
    }
}

export default SourceExtension;
