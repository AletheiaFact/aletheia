import { useCommands, useCurrentSelection } from "@remirror/react";
import { CommandButton, FloatingToolbar } from "@remirror/react-ui";
import { useAtom } from "jotai";
import React, { useContext } from "react";
import { currentUserRole } from "../../../atoms/currentUser";
import { Roles } from "../../../types/enums";
import { useAppSelector } from "../../../store/store";
import { ReviewTaskTypeEnum } from "../../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { useSelector } from "@xstate/react";
import { reviewingSelector } from "../../../machines/reviewTask/selectors";

const FloatingMenuIcons = ({
    handleClickEditLink,
    readonly,
    linkPositioner,
    isSelected,
    isEditing,
    onSelect,
}) => {
    const { reviewTaskType, machineService } = useContext(
        ReviewTaskMachineContext
    );
    const enableEditorAnnotations = useAppSelector(
        ({ enableEditorAnnotations }) => enableEditorAnnotations
    );
    const [role] = useAtom(currentUserRole);
    const { addAnnotation } = useCommands();
    const { empty } = useCurrentSelection();
    const isReviewing = useSelector(machineService, reviewingSelector);
    const enabled = enableEditorAnnotations
        ? addAnnotation?.enabled({ id: "" })
        : true;

    return (
        <FloatingToolbar
            data-cy="testFloatingLinkToolbar"
            positioner={
                !isEditing && isSelected && empty ? linkPositioner : "selection"
            }
        >
            {!readonly && reviewTaskType === ReviewTaskTypeEnum.Claim && (
                <CommandButton
                    commandName="updateLink"
                    onSelect={handleClickEditLink}
                    icon="link"
                    enabled
                />
            )}
            {isReviewing &&
                role !== Roles.Regular &&
                role !== Roles.FactChecker && (
                    <CommandButton
                        icon="chatNewLine"
                        commandName="addAnnotation"
                        enabled={enabled}
                        onSelect={onSelect}
                    />
                )}
        </FloatingToolbar>
    );
};

export default FloatingMenuIcons;
