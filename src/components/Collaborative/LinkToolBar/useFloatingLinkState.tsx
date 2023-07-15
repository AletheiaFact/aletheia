import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import {
    ShortcutHandlerProps,
    createMarkPositioner,
    LinkExtension,
} from "remirror/extensions";

import {
    useAttrs,
    useChainedCommands,
    useCurrentSelection,
    useExtensionEvent,
    useUpdateReason,
} from "@remirror/react";

function useLinkShortcut() {
    const [linkShortcut, setLinkShortcut] = useState<
        ShortcutHandlerProps | undefined
    >();
    const [isEditing, setIsEditing] = useState(false);

    useExtensionEvent(
        LinkExtension,
        "onShortcut",
        useCallback(
            (props) => {
                if (!isEditing) {
                    setIsEditing(true);
                }

                return setLinkShortcut(props);
            },
            [isEditing]
        )
    );

    return { linkShortcut, isEditing, setIsEditing };
}

function useFloatingLinkState() {
    const chain = useChainedCommands();
    const { isEditing, linkShortcut, setIsEditing } = useLinkShortcut();
    const { to, empty } = useCurrentSelection();
    const url = (useAttrs().link()?.href as string) ?? "";
    const [href, setHref] = useState<string>(url);

    // A positioner which only shows for links.
    const linkPositioner = useMemo(
        () => createMarkPositioner({ type: "link" }),
        []
    );

    const onRemove = useCallback(
        () => chain.removeLink().focus().run(),
        [chain]
    );

    const onOpen = useCallback(() => {
        window.open(href, "_blank");
    }, [href]);

    const updateReason = useUpdateReason();

    useLayoutEffect(() => {
        if (!isEditing) {
            return;
        }

        if (updateReason.doc || updateReason.selection) {
            setIsEditing(false);
        }
    }, [isEditing, setIsEditing, updateReason.doc, updateReason.selection]);

    useEffect(() => {
        setHref(url);
    }, [url]);

    const submitHref = useCallback(() => {
        setIsEditing(false);
        const range = linkShortcut ?? undefined;

        if (href === "") {
            chain.removeLink();
        } else {
            chain.updateLink({ href, auto: false }, range);
        }

        chain.focus(range?.to ?? to).run();
    }, [setIsEditing, linkShortcut, chain, href, to]);

    const cancelHref = useCallback(() => {
        setIsEditing(false);
    }, [setIsEditing]);

    const clickEdit = useCallback(() => {
        if (empty) {
            chain.selectLink();
        }

        setIsEditing(true);
    }, [chain, empty, setIsEditing]);

    return useMemo(
        () => ({
            href,
            setHref,
            linkShortcut,
            linkPositioner,
            isEditing,
            clickEdit,
            onRemove,
            onOpen,
            submitHref,
            cancelHref,
        }),
        [
            href,
            linkShortcut,
            linkPositioner,
            isEditing,
            clickEdit,
            onRemove,
            onOpen,
            submitHref,
            cancelHref,
        ]
    );
}

export default useFloatingLinkState;
