import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useContext, useState } from "react";
import { currentUserRole } from "../../atoms/currentUser";

import Fab from "./Fab";
import { useAppSelector } from "../../store/store";
import ChatIcon from "@mui/icons-material/Chat";
import { Roles } from "../../types/enums";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";
import StartReviewAlertModal from "../Modal/StartReviewAlertModal";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";

const AffixCopilotButton = () => {
    const dispatch = useDispatch();
    const { machineService } = useContext(ReviewTaskMachineContext);

    const { vw, copilotDrawerCollapsed } = useAppSelector((state) => ({
        vw: state?.vw,
        copilotDrawerCollapsed:
            state?.copilotDrawerCollapsed !== undefined
                ? state?.copilotDrawerCollapsed
                : true,
    }));
    const [userRole] = useAtom(currentUserRole);
    const { t } = useTranslation();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        const currentState = machineService?.getSnapshot()?.value;

        if (currentState === "unassigned") {
            setIsModalOpen(true);
        } else {
            dispatch(actions.openCopilotDrawer());
        }
    };

    if (userRole === Roles.Regular) {
        return null;
    }

    if (copilotDrawerCollapsed) {
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
                        data-cy={"testCopilotFloatButton"}
                        icon={
                            <ChatIcon
                                style={{
                                    fontSize: "27px",
                                }}
                            />
                        }
                    />
                </div>

                <StartReviewAlertModal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                />
            </>
        );
    }

    return null;
};

export default AffixCopilotButton;
