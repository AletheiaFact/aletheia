import React, { useContext, useState } from "react";
import AletheiaButton, { ButtonType } from "../../../Button";
import { uniqueId } from "remirror";
import SourceDialog from "../LinkToolBar/Dialog/SourceDialog";
import { VisualEditorContext } from "../../VisualEditorProvider";
import { useTranslation } from "next-i18next";
import AddIcon from '@mui/icons-material/Add';
import { URL_PATTERN } from "../../hooks/useFloatingLinkState";
import { HTTP_PROTOCOL_REGEX } from "../LinkToolBar/FloatingLinkToolbar";
import { useCommands } from "@remirror/react";
import { Node } from "@remirror/pm/model";
import { useAppSelector } from "../../../../store/store";

const EditorAddSources = ({
    nodeFromJSON,
    doc,
}: {
    nodeFromJSON: (json: any) => Node;
    doc: Node;
}) => {
    const enableAddEditorSourcesWithoutSelecting = useAppSelector(
        (state) => state?.enableAddEditorSourcesWithoutSelecting
    );
    const command = useCommands();
    const { t } = useTranslation();
    const [href, setHref] = useState("https://");
    const [showDialog, setShowDialog] = useState(false);
    const [error, setError] = useState(null);
    const { setEditorSources } = useContext(VisualEditorContext);
    const [isLoading, setIsLoading] = useState(false);

    const validateFloatingLink = () => {
        if (!URL_PATTERN.test(href)) {
            throw new Error(t("sourceForm:errorMessageValidURL"));
        }
    };

    const getNodeObject = (id, href) => ({
        type: "text",
        marks: [
            {
                type: "link",
                attrs: {
                    id: id,
                    href: href,
                    target: null,
                    auto: true,
                },
            },
        ],
        text: " ",
    });

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
            command.insertNode(nodeFromJSON(getNodeObject(id, href)), {
                selection: doc.content.size,
                replaceEmptyParentBlock: true,
            });
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
                        {t(
                            `sourceForm:${
                                enableAddEditorSourcesWithoutSelecting
                                    ? "editorEmptySourcesWithButton"
                                    : "editorEmptySources"
                            }`
                        )}
                    </p>
                    {enableAddEditorSourcesWithoutSelecting && (
                        <AletheiaButton
                            buttonType={ButtonType.gray}
                            onClick={() => setShowDialog(true)}
                            data-cy="testAddEditorSources"
                        >
                            <AddIcon style={{ fontSize: "24px" }} />
                        </AletheiaButton>
                    )}
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
