import { createContext, useMemo, useState } from "react";
import { useAppSelector } from "../../store/store";
import { createWebsocketConnection } from "./utils/createWebsocketConnection";

interface ContextType {
    websocketProvider: any;
    setEditorContent?: (data: any) => void;
    editorContent?: any;
    editorError?: any;
    setEditorError?: (data: any) => void;
}

export const CollaborativeEditorContext = createContext<ContextType>({
    websocketProvider: null,
});

interface CollaborativeEditorProviderProps {
    data_hash: string;
    children: React.ReactNode;
}

export const CollaborativeEditorProvider = (
    props: CollaborativeEditorProviderProps
) => {
    const [editorContent, setEditorContent] = useState("");
    const [editorError, setEditorError] = useState(null);
    const { websocketUrl } = useAppSelector((state) => state);

    const websocketProvider = useMemo(
        () => createWebsocketConnection(props.data_hash, websocketUrl),
        [props.data_hash]
    );

    return (
        <CollaborativeEditorContext.Provider
            value={{
                websocketProvider,
                editorContent,
                setEditorContent,
                editorError,
                setEditorError,
            }}
        >
            {props.children}
        </CollaborativeEditorContext.Provider>
    );
};
