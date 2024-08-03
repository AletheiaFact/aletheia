import type { ChangeEvent, KeyboardEvent } from "react";
import { FloatingWrapper, useActive } from "@remirror/react";
import React from "react";

import SourceDialog from "./Dialog/SourceDialog";
import { useTranslation } from "next-i18next";

export const HTTP_PROTOCOL_REGEX = /(https?:\/\/)(https?:\/\/)+/;

const FloatingLinkToolbar = ({
    isEditing,
    onRemoveLink,
    submitHref,
    href,
    setHref,
    cancelHref,
    error,
    isLoading,
}) => {
    const { t } = useTranslation();
    const active = useActive();
    const activeLink = active.link();

    const handleInputChange = ({
        target: { value },
    }: ChangeEvent<HTMLInputElement>) => {
        // Prevent href with double http protocol
        const href = value.replace(HTTP_PROTOCOL_REGEX, "$1");
        setHref(href);
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const { code } = event;

        if (code === "Enter") {
            event.preventDefault();
            submitHref();
        }

        if (code === "Escape") {
            cancelHref();
        }
    };

    const handleClickButton = () => submitHref();
    const handleCloseModal = () => cancelHref();
    const handleRemoveLink = () => onRemoveLink();

    return (
        <FloatingWrapper
            positioner="selection"
            placement="bottom"
            enabled={isEditing}
            renderOutsideEditor={false}
            key="Link-wrapper"
        >
            <SourceDialog
                autoFocus
                placeholder={t("sourceForm:placeholder")}
                value={href}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                handleClickButton={handleClickButton}
                onCloseModal={handleCloseModal}
                error={error}
                activeLink={activeLink}
                onRemoveLink={handleRemoveLink}
                isLoading={isLoading}
            />
        </FloatingWrapper>
    );
};

export default FloatingLinkToolbar;
