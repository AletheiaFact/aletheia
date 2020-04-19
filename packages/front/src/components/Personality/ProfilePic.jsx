import React, { Component } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

class ProfilePic extends Component {
    render() {
        const imageStyle = {
            backgroundImage: `url(${this.props.image})`
        };
        return (
            <>
                {this.props.image ? (
                    <div className="thumbnail">
                        <div className="thumbnail__container">
                            <div
                                className="thumbnail__img"
                                style={imageStyle || ""}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <Avatar shape="square" size={200} icon={<UserOutlined />} />
                )}
            </>
        );
    }
}

export default ProfilePic;
