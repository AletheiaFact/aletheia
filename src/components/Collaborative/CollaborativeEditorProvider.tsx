import { createContext, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../store/store";
import { createWebsocketConnection } from "./utils/createWebsocketConnection";
import ClaimReviewTaskApi from "../../api/ClaimReviewTaskApi";
import { RemirrorJSON } from "remirror";

interface ContextType {
    websocketProvider: any;
    editorContentObject?: RemirrorJSON;
    setEditorContentObject?: (data: any) => void;
    useCardPresence?: (
        getJSON: any,
        state: any,
        cardType: any,
        initialState: any
    ) => boolean;
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

    // Custom hook to check if a specific card type is present in the JSON content
    function useCardPresence(getJSON, state, cardType, initialState) {
        const [isDisabled, setIsDisabled] = useState(initialState);

        useEffect(() => {
            const json = getJSON();
            const hasCard = json.content.some(({ type }) => type === cardType);
            if (isDisabled !== hasCard) {
                setIsDisabled(hasCard);
            }
        }, [getJSON, state, isDisabled, cardType]);

        return isDisabled;
    }

    return (
        <CollaborativeEditorContext.Provider
            value={{
                websocketProvider,
                editorContentObject,
                setEditorContentObject,
                useCardPresence,
            }}
        >
            {props.children}
        </CollaborativeEditorContext.Provider>
    );
};
