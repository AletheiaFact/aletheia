import colors from "../../styles/colors";
import UserMenuHeader from "./UserMenuHeader";
import { NameSpaceEnum } from "../../types/Namespace";
import { User } from "../../types/User";

export interface UserMenuHeaderSidebarProps {
    isLoadingUser: boolean;
    user: User | null;
    hasSession: boolean;
    nameSpace: NameSpaceEnum;
}

const UserMenuHeaderSidebar = ({
    isLoadingUser,
    user,
    hasSession,
    nameSpace,
}: UserMenuHeaderSidebarProps) => {
    return (
        <div
            style={{
                backgroundColor: `color-mix(in srgb, ${colors.lightNeutral}, transparent 90%)`,
                margin: "12px 18px",
                borderRadius: "6px",
            }}
        >
            <UserMenuHeader
                key="user-menu-header-sidebar"
                isLoadingUser={isLoadingUser}
                isWhiteLoading={true}
                user={user}
                hasSession={hasSession}
                nameSpace={nameSpace}
                isSidebar={true}
            />
        </div>
    );
};

export default UserMenuHeaderSidebar;
