import {
    DOMCompatibleAttributes,
    ExtensionTag,
    NodeExtension,
    NodeExtensionSpec,
} from "@remirror/core";
import React, { ComponentType } from "react";
import { NodeViewComponentProps } from "@remirror/react";
import { EditorClaimCard } from "./EditorClaimCard";

class EditorClaimCardExtension extends NodeExtension {
    get name() {
        return "editor-claim-card" as const;
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({
        node,
        forwardRef,
    }) => {
        const { personalityId, claimId } = node.attrs;
        console.log(node);

        return (
            <EditorClaimCard
                node={node}
                personalityId={personalityId}
                claimId={claimId}
                forwardRef={forwardRef}
            />
        );
    };

    createTags() {
        return [ExtensionTag.Block];
    }
    createNodeSpec(): NodeExtensionSpec {
        return {
            draggable: true,
            selectable: false,
            atom: true,
            isolating: true,
            attrs: {
                personalityId: { default: null },
                claimId: { default: "" },
            },
            content: "block*",
            toDOM: (node) => {
                const attrs: DOMCompatibleAttributes = {
                    "data-personality-id": node.attrs.personalityId,
                    "data-claim-id": node.attrs.claimId,
                    // 'contenteditable': 'false',
                    // 'draggable': 'true'
                };
                return ["div", attrs, 0];
            },
            parseDOM: [
                {
                    attrs: {
                        id: { default: null },
                        name: { default: "" },
                        imageSrc: { default: "" },
                    },
                    tag: "div[data-personality-id]",
                    getAttrs: (dom) => {
                        const node = dom as HTMLAnchorElement;
                        const personalityId = node.getAttribute(
                            "data-personality-id"
                        );
                        const claimId = node.getAttribute("data-claim-id");

                        return {
                            personalityId,
                            claimId,
                        };
                    },
                },
            ],
        };
    }
}

export default EditorClaimCardExtension;
