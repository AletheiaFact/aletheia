import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Spin, Row } from "antd";
import { withTranslation } from "react-i18next";
import api from "../../api/personality";
import "./PersonalityView.less";
import PersonalityCard from "./PersonalityCard";
import AffixButton from "../Form/AffixButton";
import ClaimList from "../Claim/ClaimList";
import ToggleSection from "../ToggleSection";
import MetricsOverview from "../Metrics/MetricsOverview";
import SocialMediaShare from "../SocialMediaShare";

class PersonalityView extends Component {
    constructor(props) {
        super(props);
        this.createClaim = this.createClaim.bind(this);
        this.onSectionChange = this.onSectionChange.bind(this);
        this.state = {
            showSpeechesSection: true
        };
        this.tooltipVisible = true;
        setTimeout(() => {
            this.tooltipVisible = false;
        }, 2500);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getPersonality();
        }
    }

    async getPersonality() {
        const personality = await api.getPersonality(
            this.props.match.params.id,
            {
                language: this.props.i18n.languages[0]
            }
        );
        this.setState({ personality });
    }

    componentDidMount() {
        this.getPersonality();
    }

    createClaim() {
        const path = `./${this.props.match.params.id}/claim/create`;
        this.props.history.push(path);
    }

    onSectionChange(e) {
        this.setState({
            showSpeechesSection: e.target.value
        });
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
                    <Row
                        style={{
                            textAlign: "center",
                            width: "100%"
                        }}
                    >
                        <ToggleSection
                            defaultValue={this.state.showSpeechesSection}
                            labelTrue={t("personality:toggleSectionSpeeches")}
                            labelFalse={t("metrics:headerTitle")}
                            onChange={this.onSectionChange}
                        ></ToggleSection>
                    </Row>
                    {this.state.showSpeechesSection ? (
                        <ClaimList personality={personality}></ClaimList>
                    ) : (
                        <MetricsOverview stats={personality.stats} />
                    )}
                    <SocialMediaShare quote={personality.name} />
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
