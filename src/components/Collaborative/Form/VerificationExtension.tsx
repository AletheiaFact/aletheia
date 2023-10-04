import {
    DOMCompatibleAttributes,
    ExtensionTag,
    NodeExtension,
    NodeExtensionSpec,
} from "@remirror/core";
import React, { ComponentType } from "react";
import { NodeViewComponentProps } from "@remirror/react";
import { VerificationCard } from "./VerificationCard";

class VerificationExtesion extends NodeExtension {
    get name() {
        return "verification" as const;
    }

    ReactComponent: ComponentType<NodeViewComponentProps> = ({
        node,
        forwardRef,
    }) => {
        return <VerificationCard node={node} forwardRef={forwardRef} />;
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
                    "data-verification-id": node.attrs.verificationId,
                };
                return ["div", attrs, 0];
            },
            parseDOM: [
                {
                    attrs: {
                        verificationId: { default: "" },
                    },
                    tag: `div[data-verification-id]`,
                    getAttrs: (dom) => {
                        const node = dom as HTMLDivElement;
                        const verificationId = node.getAttribute(
                            "data-verification-id"
                        );

                        return {
                            verificationId,
                        };
                    },
                },
            ],
        };
    }
}

export default VerificationExtesion;
