import React from "react";
import { useHeaderData } from "./useHeaderData";
import UserMenuHeaderSidebar from "./UserMenuHeaderSidebar";

const SidebarContent = () => {
    const { state, actions } = useHeaderData();

    return (
        <UserMenuHeaderSidebar
            hasSession={state.hasSession}
            userId={state.userId}
            isLoading={state.isLoading}
            nameSpace={state.nameSpace}
            t={actions.t}
        />
    );
};

export default SidebarContent;
