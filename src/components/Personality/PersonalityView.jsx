import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { Spin, Row } from "antd";
import { withTranslation } from "react-i18next";

import "./PersonalityView.less";
import PersonalityCard from "./PersonalityCard";
import AffixButton from "../Form/AffixButton";
import ClaimCard from "../Claim/ClaimCard";
import ReviewStats from "../ReviewStats";

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

    componentDidMount() {
        const self = this;
        self.getPersonality();
    }

    getPersonality() {
        axios
            .get(
                `${process.env.API_URL}/personality/${this.props.match.params.id}`,
                {
                    params: {
                        language: this.props.i18n.languages[0]
                    }
                }
            )
            .then(response => {
                const personality = response.data;
                this.setState({ personality });
            })
            .catch(() => {
                console.log("Error while fetching Personality");
            });
    }

    createClaim() {
        const path = `./${this.props.match.params.id}/claim/create`;
        this.props.history.push(path);
    }

    viewClaim(id) {
        const path = `./${this.props.match.params.id}/claim/${id}`;
        this.props.history.push(path);
    }

    render() {
        const personality = this.state.personality;
        const { t } = this.props;
        if (personality) {
            const imageStyle = {
                backgroundImage: `url(${personality.image})`
            };
            return (
                <>
                    <PersonalityCard personality={personality} />
                    <br />
                    <AffixButton
                        tooltipTitle={t("personality:affixButtonTitle")}
                        onClick={this.createClaim}
                    />
                    <Row style={{ background: "white" }}>
                        {personality.claims.map((claim, claimIndex) => (
                            <ClaimCard
                                key={claimIndex}
                                personality={personality}
                                claim={claim}
                                viewClaim={this.viewClaim}
                            />
                        ))}
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
