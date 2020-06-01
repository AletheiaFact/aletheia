import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
    Divider,
    Avatar,
    Affix,
    Comment,
    Spin,
    Table,
    Button,
    Col,
    Row,
    Typography,
    Tooltip
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import "./PersonalityView.css";
import ReviewStats from "../ReviewStats";
import ProfilePic from "./ProfilePic";
import PersonalityCard from "./PersonalityCard";
import { withTranslation } from "react-i18next";
import AffixButton from "../Form/AffixButton";

const { Title, Text, Paragraph } = Typography;
const { Column } = Table;

function AffixButton(props) {
    // const [bottom, setBottom] = useState(10);
    // @TODO use antd affix
    return (
        // <Affix offsetBottom={10}>
        <Tooltip
            placement="left"
            defaultVisible={props.tooltipVisible}
            title="Clique aqui para adicionar uma claim"
        >
            <Button
                style={{
                    position: "fixed",
                    zInex: 9999,
                    bottom: "3%",
                    left: "85%"
                }}
                size="large"
                shape="circle"
                onClick={props.createClaim}
                type="primary"
                icon={<PlusOutlined />}
            ></Button>
        </Tooltip>
        // </Affix>
    );
}

function ClaimCard(props) {
    return (
        <Col span={24}>
            <Comment
                style={{ margin: "0px 20px" }}
                key={props.claimIndex}
                author={props.personality.name}
                avatar={
                    <Avatar
                        src={props.personality.image}
                        alt={props.personality.name}
                    />
                }
                content={
                    <>
                        <Row>
                            <Col>
                                <p>{props.claim.title}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={16}>
                                <Button
                                    shape="round"
                                    type="primary"
                                    onClick={e => {
                                        e.stopPropagation();
                                        props.viewClaim(props.claim._id);
                                    }}
                                >
                                    Revisar
                                </Button>
                            </Col>
                        </Row>
                    </>
                }
                datetime={
                    <Tooltip title="01/2020">
                        <span>há 5 meses</span>
                    </Tooltip>
                }
            />
            <hr style={{ opacity: "20%" }} />
        </Col>
    );
}

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
            const { reviews } = personality.stats;
            return (
                <>
                    <PersonalityCard personality={personality} />
                    <Row style={{ padding: "5px 30px" }}>
                        <ReviewStats dataSource={reviews} />
                    </Row>
                    <br />
                    <AffixButton
                        tooltipVisible={this.tooltipVisible}
                        createClaim={this.createClaim}
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
                        width: "100%"
                    }}
                ></Spin>
            );
        }
    }
}
export default withRouter(withTranslation()(PersonalityView));
