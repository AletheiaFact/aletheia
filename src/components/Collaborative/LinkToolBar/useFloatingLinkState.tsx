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
import { useTranslation } from "next-i18next";

function useUpdateSelection() {
    const { empty } = useCurrentSelection();
    const isSelected = !empty;

    return isSelected;
}

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
    const { t } = useTranslation();

    const [error, setError] = useState(null);
    const chain = useChainedCommands();
    const { isEditing, linkShortcut, setIsEditing } = useLinkShortcut();
    const { to, empty } = useCurrentSelection();
    const url = (useAttrs().link()?.href as string) ?? "https://";
    const [href, setHref] = useState<string>(url);

    const isSelected = useUpdateSelection();

    // A positioner which only shows for links.
    const linkPositioner = useMemo(
        () => createMarkPositioner({ type: "link" }),
        []
    );

    const onRemoveLink = useCallback(
        () => chain.removeLink().focus().run(),
        [chain]
    );

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

    const validateLink = useCallback(() => {
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlPattern.test(href)) {
            throw new Error(t("sourceForm:errorMessageValidURL"));
        }
    }, [href, t]);

    const submitHref = useCallback(() => {
        try {
            validateLink();
            setIsEditing(false);
            const range = linkShortcut ?? undefined;

            if (href === "") {
                chain.removeLink();
            } else {
                chain.updateLink({ href, auto: false }, range);
            }
            chain.focus(range?.to ?? to).run();
        } catch (error) {
            setError(error.message);
        } finally {
            setHref("https://");
        }
    }, [validateLink, setIsEditing, linkShortcut, href, chain, to]);

    const cancelHref = useCallback(() => {
        setIsEditing(false);
    }, [setIsEditing]);

    const clickEdit = useCallback(() => {
        setError(null);
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
            onRemoveLink,
            submitHref,
            cancelHref,
            isSelected,
            error,
        }),
        [
            href,
            linkShortcut,
            linkPositioner,
            isEditing,
            clickEdit,
            onRemoveLink,
            submitHref,
            cancelHref,
            isSelected,
            error,
        ]
    );
}

export default useFloatingLinkState;
