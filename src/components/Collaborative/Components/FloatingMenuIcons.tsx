import { useCommands, useCurrentSelection } from "@remirror/react";
import { CommandButton, FloatingToolbar } from "@remirror/react-ui";
import React, { useContext } from "react";
import { useAppSelector } from "../../../store/store";
import { ReviewTaskTypeEnum } from "../../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../../machines/reviewTask/ReviewTaskMachineProvider";
import { useSelector } from "@xstate/react";
import {
    crossCheckingSelector,
    reviewingSelector,
} from "../../../machines/reviewTask/selectors";
import { useReviewTaskPermissions } from "../../../machines/reviewTask/usePermissions";

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
    const { isAssignee, isReviewer, isCrossChecker, isAdmin } =
        useReviewTaskPermissions();
    const { addAnnotation } = useCommands();
    const { empty } = useCurrentSelection();
    const isReviewing = useSelector(machineService, reviewingSelector);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);
    const enabled = enableEditorAnnotations
        ? addAnnotation?.enabled({ id: "" })
        : true;
    const canAddComment = isAdmin || isAssignee || isReviewer || isCrossChecker;

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
            {(isReviewing || isCrossChecking) && canAddComment && (
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
