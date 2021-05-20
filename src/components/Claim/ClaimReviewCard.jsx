import React, { Component } from "react";
import { Avatar, Comment } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReviewColors from "../../constants/reviewColors";
import { withTranslation } from "react-i18next";
import userApi from "../../api/user";

class ClaimReviewCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ""
        };
    }

    async componentDidMount() {
        const anonymousName = this.props.t("claimReview:anonymousUserName");
        // Get user data
        if (!this.props.userId) {
            this.setState({
                username: anonymousName
            });
        } else {
            const user = await userApi.getById(this.props.userId);
            this.setState({
                username: user.name || anonymousName
            });
        }
    }

    render() {
        const { t } = this.props;
        return (
            <Comment
                style={{
                    width: "100%"
                }}
                avatar={<Avatar size={45} icon={<UserOutlined />} />}
                author={t("claimReview:cardAuthor", {
                    name: this.state.username
                })}
                content={
                    <span
                        style={{
                            color:
                                ReviewColors[this.props.classification] ||
                                "#000",
                            fontWeight: "bold",
                            textTransform: "uppercase"
                        }}
                    >
                        {t(`claimReviewForm:${this.props.classification}`)}{" "}
                    </span>
                }
            />
        );
    }
}

export default withTranslation()(ClaimReviewCard);
