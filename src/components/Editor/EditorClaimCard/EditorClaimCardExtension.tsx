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
        const { personalityId, speechId } = node.attrs;

        return (
            <EditorClaimCard
                node={node}
                personalityId={personalityId}
                speechId={speechId}
                forwardRef={forwardRef}
            />
        );
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
            attrs: {
                personalityId: { default: "" },
                speechId: { default: "" },
                cardId: { default: "" },
            },
            content: "block*",
            toDOM: (node) => {
                const attrs: DOMCompatibleAttributes = {
                    "data-personality-id": node.attrs.personalityId,
                    "data-speech-id": node.attrs.speechId,
                    "card-id": node.attrs.cardId,
                };
                return ["div", attrs, 0];
            },
            parseDOM: [
                {
                    attrs: {
                        personalityId: { default: "" },
                        speechId: { default: "" },
                        cardId: { default: "" },
                    },
                    tag: `div[card-id]`,
                    getAttrs: (dom) => {
                        const node = dom as HTMLAnchorElement;
                        const personalityId =
                            node.getAttribute(`data-personality-id`);
                        const speechId = node.getAttribute("data-speech-id");
                        const cardId = node.getAttribute("card-id");

                        return {
                            personalityId,
                            speechId,
                            cardId,
                        };
                    },
                },
            ],
        };
    }
}

export default EditorClaimCardExtension;
