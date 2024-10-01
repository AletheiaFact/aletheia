import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import { currentUserRole } from "../../atoms/currentUser";

import Fab from "./Fab";
import { useAppSelector } from "../../store/store";
import ChatIcon from "@mui/icons-material/Chat";
import { Roles } from "../../types/enums";
import actions from "../../store/actions";
import { useDispatch } from "react-redux";

const AffixCopilotButton = () => {
    const dispatch = useDispatch();
    const { vw, copilotDrawerCollapsed } = useAppSelector((state) => ({
        vw: state?.vw,
        copilotDrawerCollapsed:
            state?.copilotDrawerCollapsed !== undefined
                ? state?.copilotDrawerCollapsed
                : true,
    }));
    const [userRole] = useAtom(currentUserRole);
    const { t } = useTranslation();

    const handleClick = () => {
        dispatch(actions.openCopilotDrawer());
    };

    if (userRole === Roles.Regular) {
        return null;
    }

    if (copilotDrawerCollapsed) {
        return (
            <div
                style={{
                    position: "fixed",
                    bottom: "3%",
                    right:
                        copilotDrawerCollapsed || vw?.md
                            ? "2%"
                            : `calc(2% + 350px)`,
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
        );
    }
};

export default AffixCopilotButton;
