import React, { useContext, useState } from "react";
import AletheiaButton, { ButtonType } from "../../../AletheiaButton";
import { uniqueId } from "remirror";
import SourceDialog from "../LinkToolBar/Dialog/SourceDialog";
import { VisualEditorContext } from "../../VisualEditorProvider";
import AddIcon from "@mui/icons-material/Add";
import { validateUrl } from "../../../../utils/ValidateUrl";
import { HTTP_PROTOCOL_REGEX } from "../LinkToolBar/FloatingLinkToolbar";
import { useCommands } from "@remirror/react";
import { Node } from "@remirror/pm/model";
import { useTranslations } from "next-intl";

const EditorAddSources = ({
    nodeFromJSON,
    doc,
}: {
    nodeFromJSON: (json: any) => Node;
    doc: Node;
}) => {
    const command = useCommands();
    const tSourceForm = useTranslations("sourceForm");
    const t = useTranslations();
    const [href, setHref] = useState("https://");
    const [showDialog, setShowDialog] = useState(false);
    const [error, setError] = useState(null);
    const { setEditorSources, editorConfiguration } =
        useContext(VisualEditorContext);
    const [isLoading, setIsLoading] = useState(false);

    if (editorConfiguration?.readonly) {
        return null;
    }

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
        setIsLoading(true);

        const errorMessage = validateUrl(href, t);

        if (errorMessage) {
            setError(errorMessage);
            setIsLoading(false);
            return;
        }

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

        setEditorSources((sources) => [...sources, newSource]);
        setShowDialog(false);
        command.insertNode(nodeFromJSON(getNodeObject(id, href)), {
            selection: doc.content.size,
            replaceEmptyParentBlock: true,
        });
        setError(null);
        setIsLoading(false);
    };

    const handleInputChange = ({ target: { value } }) => {
        const href = value.replace(HTTP_PROTOCOL_REGEX, "$1");
        setHref(href);

        const errorMessage = validateUrl(href, t);

        if (errorMessage) {
            setError(errorMessage);
        } else {
            setError(null);
        }
    };

    return (
        <div className="add-sources-container">
            {!showDialog ? (
                <>
                    <p className="empty-text">
                        {tSourceForm("editorEmptySourcesWithButton")}
                    </p>
                    <AletheiaButton
                        type={ButtonType.gray}
                        onClick={() => setShowDialog(true)}
                        data-cy="testAddEditorSources"
                    >
                        <AddIcon style={{ fontSize: "24px" }} />
                    </AletheiaButton>
                </>
            ) : (
                <SourceDialog
                    autoFocus
                    placeholder={tSourceForm("placeholder")}
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
