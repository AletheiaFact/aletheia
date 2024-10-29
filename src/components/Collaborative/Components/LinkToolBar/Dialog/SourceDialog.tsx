import React, { useEffect, useRef } from "react";

import InsertSourceForm from "./InsertSourceForm";
import SourceDialogHeader from "./SourceDialogHeader";
import colors from "../../../../../styles/colors";

const SourceDialog = ({
    autoFocus,
    handleClickButton,
    error,
    onCloseModal,
    isLoading,
    activeLink = null,
    onRemoveLink = () => { },
    ...rest
}) => {
    const inputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if (!autoFocus) {
            return;
        }

        const focusTimeout = setTimeout(() => {
            inputRef.current?.focus();
        }, 10);

        return () => {
            clearTimeout(focusTimeout);
        };
    }, [autoFocus]);

    return (
        <div
            style={{
                background: colors.lightNeutral,
                padding: "10px",
                borderRadius: "8px",
                boxShadow: `0px 0px 15px ${colors.Shadow}`,
            }}
        >
            <SourceDialogHeader onCloseModal={onCloseModal} />
            <InsertSourceForm
                inputRef={inputRef}
                handleClickButton={handleClickButton}
                activeLink={activeLink}
                onRemoveLink={onRemoveLink}
                error={error}
                isLoading={isLoading}
                {...rest}
            />
        </div>
    );
};

export default SourceDialog;
