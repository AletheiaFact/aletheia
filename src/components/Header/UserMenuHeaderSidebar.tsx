import { useEffect, useState } from "react";
import userApi from "../../api/userApi";
import colors from "../../styles/colors";
import UserMenuHeader from "./UserMenuHeader";
import Loading from "../Loading";

const UserMenuHeaderSidebar = ({
    hasSession,
    userId,
    isLoading,
    nameSpace,
    t,
}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (hasSession && userId) {
            userApi.getById(userId).then((userData) => {
                setUser(userData);
            });
        }
    }, [hasSession, userId]);

    if (hasSession && !user) {
        return <Loading isWhiteLoading={true} />;
    }

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
                isLoading={isLoading}
                user={user}
                nameSpace={nameSpace}
                t={t}
                isSidebar={true}
            />
        </div>
    );
};

export default UserMenuHeaderSidebar;
