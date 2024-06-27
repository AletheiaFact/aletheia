import {
    NodeExtension,
    NodeExtensionSpec,
    ExtensionTag,
    DOMCompatibleAttributes,
} from "@remirror/core";
import React, { ComponentType } from "react";
import { NodeViewComponentProps } from "@remirror/react";

function createNodeExtension({ name, componentName, dataAttributeName }) {
    return class extends NodeExtension {
        get name() {
            return name;
        }

        ReactComponent: ComponentType<NodeViewComponentProps> = ({
            node,
            forwardRef,
            getPosition,
        }) => {
            const Component = componentName;

            return (
                <Component
                    node={node}
                    forwardRef={forwardRef}
                    initialPosition={getPosition()}
                />
            );
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
                        [`data-${dataAttributeName}`]:
                            node.attrs[dataAttributeName],
                    };
                    return ["div", attrs, 0];
                },
                parseDOM: [
                    {
                        attrs: {
                            [dataAttributeName]: { default: "" },
                        },
                        tag: `div[data-${dataAttributeName}]`,
                        getAttrs: (dom) => {
                            const node = dom as HTMLDivElement;
                            const value = node.getAttribute(
                                `data-${dataAttributeName}`
                            );
                            return { [dataAttributeName]: value };
                        },
                    },
                ],
            };
        }
    };
}

export default createNodeExtension;
