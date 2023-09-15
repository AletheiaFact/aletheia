import { createContext, useMemo, useState } from "react";

import { createWebsocketConnection } from "./utils/createWebsocketConnection";
import { useAppSelector } from "../../store/store";

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
    const { enableCollaborativeEdit } = useAppSelector((state) => ({
        enableCollaborativeEdit: state?.enableCollaborativeEdit,
    }));

    const [editorContent, setEditorContent] = useState("");
    const [editorError, setEditorError] = useState(null);

    const websocketProvider = useMemo(() => {
        if (enableCollaborativeEdit) {
            return createWebsocketConnection(props.data_hash);
        }
        return null;
    }, [enableCollaborativeEdit, props.data_hash]);

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
