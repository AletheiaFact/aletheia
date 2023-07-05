import React from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { Remirror, useRemirror } from "@remirror/react";
import {
    AnnotationExtension,
    PlaceholderExtension,
    YjsExtension,
    LinkExtension,
} from "remirror/extensions";
import { AllStyledComponent } from "@remirror/styles/styled-components";
import styled from "styled-components";

const CollaborativeEditorStyle = styled(AllStyledComponent)`
    background-color: #fff;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: none;
    min-height: 2rem;
    width: 100%;
    padding: 10px;

    ::placeholder {
        color: #515151;
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    }

    :active {
        border: none;
    }

    :hover {
        border: none;
    }

    :focus-visible {
        outline: none;
    }
`;

const ydoc = new Y.Doc();

const wsProvider = new WebsocketProvider(
    "ws://localhost:1234",
    "Aletheia",
    ydoc
);

const extensions = () => [
    new AnnotationExtension(),
    new PlaceholderExtension({
        placeholder: "Open second tab and start to type...",
    }),
    new LinkExtension({ autoLink: true }),
    new YjsExtension({ getProvider: () => wsProvider }),
];

const CollaborativeEditor = ({ defaultValue, placeholder }) => {
    const { manager, state } = useRemirror({
        extensions,
        core: { excludeExtensions: ["history"] },
        stringHandler: "html",
    });

    return (
        <CollaborativeEditorStyle>
            <Remirror
                manager={manager}
                initialContent={state}
                autoFocus
                autoRender="end"
            />
        </CollaborativeEditorStyle>
    );
};

export default CollaborativeEditor;
