import { Avatar, Tooltip } from "antd";
import React from "react";
import colors from "../../styles/colors";

const UserTag = ({ user }) => {
    const firstLetter = user[0];
    return (
        <Tooltip title={user} placement="top">
            <Avatar
                style={{
                    backgroundColor: colors.blueSecondary,
                    verticalAlign: "middle",
                }}
                size="small"
            >
                {firstLetter}
            </Avatar>
        </Tooltip>
    );
};

export default UserTag;
