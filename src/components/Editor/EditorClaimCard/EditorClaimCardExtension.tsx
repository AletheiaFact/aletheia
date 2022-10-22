import {
    DOMCompatibleAttributes,
    ExtensionTag,
    NodeExtension,
    NodeExtensionSpec,
} from "@remirror/core";
import React, { ComponentType } from "react";
import { NodeViewComponentProps } from "@remirror/react";
import { EditorClaimCard } from "./EditorClaimCard";

export const EditorClaimCardNodeType = "editor-claim-card";

class EditorClaimCardExtension extends NodeExtension {
    get name() {
        return "editor-claim-card" as const;
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({
        node,
        forwardRef,
    }) => {
        const { personalityId, claimId } = node.attrs;

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
            selectable: true,
            attrs: {
                personalityId: { default: "" },
                claimId: { default: "" },
                cardId: { default: "" },
            },
            content: "block*",
            toDOM: (node) => {
                const attrs: DOMCompatibleAttributes = {
                    "data-personality-id": node.attrs.personalityId,
                    "data-claim-id": node.attrs.claimId,
                    "card-id": node.attrs.cardId,
                };
                return ["div", attrs, 0];
            },
            parseDOM: [
                {
                    attrs: {
                        personalityId: { default: "" },
                        claimId: { default: "" },
                        cardId: { default: "" },
                    },
                    tag: `div[card-id]`,
                    getAttrs: (dom) => {
                        const node = dom as HTMLAnchorElement;
                        const personalityId =
                            node.getAttribute(`data-personality-id`);
                        const claimId = node.getAttribute("data-claim-id");
                        const cardId = node.getAttribute("card-id");

                        return {
                            personalityId,
                            claimId,
                            cardId,
                        };
                    },
                },
            ],
        };
    }
}

export default EditorClaimCardExtension;
