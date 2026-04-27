import React from "react";
import { useHeaderData } from "./useHeaderData";
import UserMenuHeaderSidebar from "./UserMenuHeaderSidebar";
import SidebarNavLinks from "./SidebarNavLinks";
import DonateButton from "./DonateButton";
import { Box } from "@mui/material";
import localConfig from "../../../config/localConfig";

const SidebarContent = () => {
    const { state, actions } = useHeaderData();
    const {
        hasSession,
        userId,
        isLoading,
        nameSpace,
        navigationConfig,
        menuInstitutionSections,
        myAccountSections
    } = state;
    const { t } = actions;

    const flatInstitutionItems = menuInstitutionSections?.flatMap(
        (section) => section.items
    ) || [];

    return (
        <>
            <UserMenuHeaderSidebar
                hasSession={hasSession}
                userId={userId}
                isLoading={isLoading}
                nameSpace={nameSpace}
                t={t}
            />

            <SidebarNavLinks
                t={t}
                sections={[
                    {
                        title: "principal",
                        items: [
                            ...(navigationConfig?.repository?.[0]?.items || []),
                            ...(navigationConfig?.main || [])
                        ]
                    }
                ]}
            />

            <SidebarNavLinks
                t={t}
                sections={myAccountSections}
            />

            <SidebarNavLinks
                t={t}
                sections={[
                    {
                        title: "institutional",
                        items: flatInstitutionItems
                    }
                ]}
            />

            <Box
                width="100%"
                padding="24px 18px"
            >
                {localConfig.header.donateButton.show &&
                    <DonateButton header={true} />
                }
            </Box>
        </>
    );
};

export default SidebarContent;
