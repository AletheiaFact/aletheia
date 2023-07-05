import React from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { Remirror, ThemeProvider, useRemirror } from "@remirror/react";
import {
    AnnotationExtension,
    PlaceholderExtension,
    YjsExtension,
    LinkExtension,
} from "remirror/extensions";

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
        <ThemeProvider>
            <Remirror
                manager={manager}
                initialContent={state}
                autoFocus
                autoRender="end"
            />
        </ThemeProvider>
    );
};

export default CollaborativeEditor;
