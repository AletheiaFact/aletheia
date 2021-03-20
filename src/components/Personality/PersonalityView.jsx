import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Spin, Row } from "antd";
import { withTranslation } from "react-i18next";
import api from "../../api/personality";
import "./PersonalityView.less";
import PersonalityCard from "./PersonalityCard";
import AffixButton from "../Form/AffixButton";
import ClaimCard from "../Claim/ClaimCard";

class PersonalityView extends Component {
    constructor(props) {
        super(props);
        this.createClaim = this.createClaim.bind(this);
        this.viewClaim = this.viewClaim.bind(this);
        this.state = {};
        this.tooltipVisible = true;
        setTimeout(() => {
            this.tooltipVisible = false;
        }, 2500);
    }

    async componentDidMount() {
        const personality = await api.getPersonality(
            this.props.match.params.id,
            {
                language: this.props.i18n.languages[0]
            }
        );
        this.setState({ personality });
    }

    createClaim() {
        const path = `./${this.props.match.params.id}/claim/create`;
        this.props.history.push(path);
    }

    viewClaim(id, link = false) {
        const path = `./${this.props.match.params.id}/claim/${id}`;
        if (!link) {
            this.props.history.push(path);
        } else {
            return path;
        }
    }

    render() {
        const personality = this.state.personality;
        const { t } = this.props;
        if (personality) {
            return (
                <>
                    <PersonalityCard personality={personality} />
                    <br />
                    <AffixButton
                        tooltipTitle={t("personality:affixButtonTitle")}
                        onClick={this.createClaim}
                    />
                    <Row style={{ background: "white" }}>
                        {personality.claims.map((claim, claimIndex) => {
                            return (
                                <ClaimCard
                                    key={claimIndex}
                                    personality={personality}
                                    claim={claim}
                                    viewClaim={this.viewClaim}
                                />
                            );
                        })}
                    </Row>
                </>
            );
        } else {
            return (
                <Spin
                    tip={t("global:loading")}
                    style={{
                        textAlign: "center",
                        position: "absolute",
                        top: "50%",
                        left: "calc(50% - 40px)"
                    }}
                ></Spin>
            );
        }
    }
}
export default withRouter(withTranslation()(PersonalityView));
