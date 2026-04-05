import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "@xstate/react";
import ChatIcon from "@mui/icons-material/Chat";

import { currentUserId, currentUserRole } from "../../atoms/currentUser";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { reviewDataSelector } from "../../machines/reviewTask/selectors";
import { useAppSelector } from "../../store/store";
import { Roles } from "../../types/enums";
import actions from "../../store/actions";

import Fab from "./Fab";
import StartReviewAlertModal from "../Modal/StartReviewAlertModal";

const AffixCopilotButton = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { machineService } = useContext(ReviewTaskMachineContext);
    const currentState = machineService.state.value;
    const reviewData = useSelector(machineService, reviewDataSelector);

    const [userRole] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);

    const { vw, copilotDrawerCollapsed = true } = useAppSelector((state) => ({
        vw: state?.vw,
        copilotDrawerCollapsed: state?.copilotDrawerCollapsed,
    }));

    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentStateValue = typeof currentState === "object" ? currentState?.assigned : currentState;
    const isCopilotAvailable = ["undraft", "reported", "unassigned"].includes(currentStateValue);
    const isUserInReview = reviewData.usersId?.includes(userId) ?? false;

    const hasAccess = (isUserInReview || currentState === "unassigned") && userRole !== Roles.Regular;
    const shouldRender = hasAccess && copilotDrawerCollapsed && isCopilotAvailable;

    const handleClick = () => {
        if (currentState === "unassigned") {
            setIsModalOpen(true);
        } else {
            dispatch(actions.openCopilotDrawer());
        }
    };

    if (!shouldRender) return null;

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    bottom: "3%",
                    right:
                        copilotDrawerCollapsed || vw?.md
                            ? "2%"
                            : `calc(2% + 50vw)`,
                    display: "flex",
                    flexDirection: "column-reverse",
                    alignItems: "center",
                    gap: "1rem",
                    zIndex: 9999,
                }}
            >
                <Fab
                    tooltipText={t("affix:affixCopilotTitle")}
                    size="70px"
                    onClick={handleClick}
                    data-cy="testCopilotFloatButton"
                    icon={<ChatIcon style={{ fontSize: "27px" }} />}
                />
            </div >

            <StartReviewAlertModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default AffixCopilotButton;
