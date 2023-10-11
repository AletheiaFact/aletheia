import { useExtensionEvent } from "@remirror/react";
import { useCallback, useState } from "react";
import { LinkExtension, ShortcutHandlerProps } from "remirror/extensions";

export default function useLinkShortcut() {
    const [linkShortcut, setLinkShortcut] = useState<
        ShortcutHandlerProps | undefined
    >();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    return { linkShortcut, isEditing, setIsEditing, isLoading, setIsLoading };
}
