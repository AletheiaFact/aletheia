import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useAppSelector } from "../../store/store";
import { createWebsocketConnection } from "./utils/createWebsocketConnection";
import ReviewTaskApi from "../../api/reviewTaskApi";
import { RemirrorContentType } from "remirror";
import { SourceType } from "../../types/Source";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { EditorConfig } from "./utils/getEditorConfig";
import {
    crossCheckingSelector,
    addCommentCrossCheckingSelector,
    reportSelector,
    reviewingSelector,
} from "../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";

interface ContextType {
    editorConfiguration?: any;
    editorSources?: SourceType[];
    setEditorSources?: (data: any) => void;
    data_hash?: string;
    isFetchingEditor?: boolean;
    comments?: any[];
    setComments?: (data: any) => void;
    source?: string;
}

export const VisualEditorContext = createContext<ContextType>({});

const editorConfig = new EditorConfig();

interface VisualEditorProviderProps {
    data_hash: string;
    children: React.ReactNode;
    source?: string;
}

export const VisualEditorProvider = (props: VisualEditorProviderProps) => {
    const { machineService, reportModel, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const {
        enableCollaborativeEdit,
        enableEditorAnnotations,
        websocketUrl,
        enableReviewersUpdateReport,
    } = useAppSelector((state) => ({
        enableCollaborativeEdit: state?.enableCollaborativeEdit,
        enableEditorAnnotations: state?.enableEditorAnnotations,
        enableReviewersUpdateReport: state?.enableReviewersUpdateReport,
        websocketUrl: state?.websocketUrl,
    }));

    const [editorContentObject, setEditorContentObject] = useState(null);
    const [editorSources, setEditorSources] = useState(
        machineService.state.context.reviewData.sources
    );
    const [isFetchingEditor, setIsFetchingEditor] = useState(false);
    const [comments, setComments] = useState(null);
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isReported = useSelector(machineService, reportSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const isAddCommentCrossChecking = useSelector(
        machineService,
        addCommentCrossCheckingSelector
    );

    const readonly = (() => {
        if (isReported) return true;
        if (isCrossChecking && !isAddCommentCrossChecking) return true;
        if (isReviewing && !enableReviewersUpdateReport) return true;
        return false;
    })();

    useEffect(() => {
        const params = { reportModel, reviewTaskType };
        const fetchEditorContentObject = (data_hash) => {
            setIsFetchingEditor(true);
            return ReviewTaskApi.getEditorContentObject(data_hash, params);
        };

        if (reportModel) {
            fetchEditorContentObject(props.data_hash).then((content) => {
                setEditorContentObject(content);
                setIsFetchingEditor(false);
            });
        }
    }, [props.data_hash, reportModel]);

    const { websocketProvider, isCollaborative } = useMemo(() => {
        if (!enableCollaborativeEdit) {
            return { websocketProvider: null, isCollaborative: null };
        }

        const websocketProvider = createWebsocketConnection(
            props.data_hash,
            websocketUrl
        );
        return {
            websocketProvider,
            isCollaborative: websocketProvider?.awareness?.states?.size > 1,
        };
    }, [enableCollaborativeEdit, props.data_hash, websocketUrl]);

    const getExtensions = useCallback(
        () =>
            editorConfig.getExtensions(
                reviewTaskType,
                websocketProvider,
                enableEditorAnnotations
            ),
        [reviewTaskType, websocketProvider, enableEditorAnnotations]
    );

    const editorConfiguration = useMemo(
        () => ({
            readonly,
            extensions: getExtensions,
            isCollaborative,
            core: { excludeExtensions: ["history"] },
            stringHandler: "html",
            content: isCollaborative
                ? undefined
                : (editorContentObject as RemirrorContentType),
        }),
        [readonly, getExtensions, isCollaborative, editorContentObject]
    );

    const value = useMemo(
        () => ({
            editorConfiguration,
            editorSources,
            setEditorSources,
            data_hash: props.data_hash,
            isFetchingEditor,
            comments,
            setComments,
            source: props.source,
        }),
        [
            editorConfiguration,
            editorSources,
            setEditorSources,
            isFetchingEditor,
            comments,
            setComments,
            props.data_hash,
            props.source,
        ]
    );

    return (
        <VisualEditorContext.Provider value={value}>
            {props.children}
        </VisualEditorContext.Provider>
    );
};
