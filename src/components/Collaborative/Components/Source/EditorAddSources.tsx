import React, { useContext, useState } from "react";
import AletheiaButton, { ButtonType } from "../../../Button";
import { uniqueId } from "remirror";
import SourceDialog from "../LinkToolBar/Dialog/SourceDialog";
import { CollaborativeEditorContext } from "../../CollaborativeEditorProvider";
import { useTranslation } from "next-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { URL_PATTERN } from "../../hooks/useFloatingLinkState";
import { HTTP_PROTOCOL_REGEX } from "../LinkToolBar/FloatingLinkToolbar";
import { useChainedCommands } from "@remirror/react";

const EditorAddSources = () => {
    const { t } = useTranslation();
    const [href, setHref] = useState("https://");
    const [showDialog, setShowDialog] = useState(false);
    const [error, setError] = useState(null);
    const { setEditorSources } = useContext(CollaborativeEditorContext);
    const [isLoading, setIsLoading] = useState(false);
    const chain = useChainedCommands();

    const validateFloatingLink = () => {
        if (!URL_PATTERN.test(href)) {
            throw new Error(t("sourceForm:errorMessageValidURL"));
        }
    };

    const updateFloatingLink = (id) => {
        chain.updateLink({ href, auto: true, id }, undefined).focus(0).run();
    };

    const submitHref = () => {
        try {
            setIsLoading(true);
            const id = uniqueId();
            const newSource = {
                href,
                props: {
                    field: null,
                    targetText: null,
                    id: id,
                    textRange: [0, 0],
                },
            };

            validateFloatingLink();
            setEditorSources((sources) => [...sources, newSource]);
            setShowDialog(false);
            updateFloatingLink(id);
            setError(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setHref("https://");
            setIsLoading(false);
        }
    };

    const handleInputChange = ({ target: { value } }) => {
        // Prevent href with double http protocol
        const href = value.replace(HTTP_PROTOCOL_REGEX, "$1");
        setHref(href);
    };

    return (
        <div className="add-sources-container">
            {!showDialog ? (
                <>
                    <p className="empty-text">
                        {t("sourceForm:editorEmptySources")}
                    </p>
                    <AletheiaButton
                        type={ButtonType.gray}
                        onClick={() => setShowDialog(true)}
                    >
                        <PlusOutlined style={{ fontSize: "24px" }} />
                    </AletheiaButton>
                </>
            ) : (
                <SourceDialog
                    autoFocus
                    placeholder={t("sourceForm:placeholder")}
                    value={href}
                    onChange={handleInputChange}
                    onKeyDown={(event) => {
                        const { code } = event;

                        if (code === "Enter") {
                            event.preventDefault();
                            submitHref();
                        }

                        if (code === "Escape") {
                            setShowDialog(false);
                        }
                    }}
                    handleClickButton={submitHref}
                    onCloseModal={() => setShowDialog(false)}
                    error={error}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default EditorAddSources;
