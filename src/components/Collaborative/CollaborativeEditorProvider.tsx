import { createContext, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../store/store";
import { createWebsocketConnection } from "./utils/createWebsocketConnection";
import ClaimReviewTaskApi from "../../api/ClaimReviewTaskApi";

interface ContextType {
    websocketProvider: any;
    setEditorContent?: (data: any) => void;
    editorContent?: any;
    editorError?: any;
    setEditorError?: (data: any) => void;
    editorContentObject?: any;
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
    const [editorContentObject, setEditorContentObject] = useState(null);
    const { websocketUrl } = useAppSelector((state) => state);

    useEffect(() => {
        const fetchEditorContentObject = (data_hash) => {
            return ClaimReviewTaskApi.getEditorContentObject(data_hash);
        };

        fetchEditorContentObject(props.data_hash).then((content) => {
            setEditorContentObject(content);
        });
    }, [props.data_hash]);

    const websocketProvider = useMemo(() => {
        if (enableCollaborativeEdit) {
            return createWebsocketConnection(props.data_hash, websocketUrl);
        }
        return null;
    }, [enableCollaborativeEdit, props.data_hash, websocketUrl]);

    return (
        <CollaborativeEditorContext.Provider
            value={{
                websocketProvider,
                editorContent,
                setEditorContent,
                editorError,
                setEditorError,
                editorContentObject,
            }}
        >
            {props.children}
        </CollaborativeEditorContext.Provider>
    );
};
