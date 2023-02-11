import React, { useCallback } from "react";
import { EditorComponent, useHelpers } from "@remirror/react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";

import EditorApi from "../../api/editor";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";
import Button from "../Button";
import { Row } from "antd";
export const EditorContent = ({ reference, isLive }) => {
    const { t } = useTranslation();
    // this needs to be called inside the scope of the provider
    // to start the machine with the correct context
    useAtom(callbackTimerAtom);
    const { getJSON } = useHelpers();
    const handleClickSave = useCallback(() => {
        return EditorApi.update(reference, getJSON(), t);
    }, [getJSON, reference, t]);

    return (
        <>
            <EditorComponent />
            <Row justify="space-between" style={{ marginTop: 16 }}>
                {isLive && (
                    <Button
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={handleClickSave}
                    >
                        {t("debates:saveButtonLabel")}
                    </Button>
                )}
            </Row>
        </>
    );
};
