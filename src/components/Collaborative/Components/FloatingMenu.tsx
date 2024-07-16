import React, { useCallback, useState } from "react";
import useFloatingLinkState from "../hooks/useFloatingLinkState";
import FloatingMenuIcons from "./FloatingMenuIcons";
import FloatingMenuContent from "./FloatingMenuContent";

const FloatingMenu = ({ readonly, state }) => {
    const [isCommentVisible, setIsCommentVisible] = useState<boolean>(false);
    const {
        isEditing,
        onRemoveLink,
        submitHref,
        href,
        setHref,
        cancelHref,
        error,
        isLoading,
        clickEdit,
        linkPositioner,
        isSelected,
    } = useFloatingLinkState();

    const handleClickEditLink = useCallback(() => {
        clickEdit();
    }, [clickEdit]);

    const onSelect = () => setIsCommentVisible(true);

    return (
        <>
            <FloatingMenuIcons
                readonly={readonly}
                handleClickEditLink={handleClickEditLink}
                isEditing={isEditing}
                isSelected={isSelected}
                linkPositioner={linkPositioner}
                onSelect={onSelect}
            />

            <FloatingMenuContent
                state={state}
                isCommentVisible={isCommentVisible}
                setIsCommentVisible={setIsCommentVisible}
                isEditing={isEditing}
                onRemoveLink={onRemoveLink}
                submitHref={submitHref}
                href={href}
                setHref={setHref}
                cancelHref={cancelHref}
                error={error}
                isLoading={isLoading}
            />
        </>
    );
};

export default FloatingMenu;
