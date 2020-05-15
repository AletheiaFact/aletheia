import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
    Divider,
    Avatar,
    Affix,
    Spin,
    Table,
    Button,
    Col,
    Row,
    Typography
} from "antd";

import "./PersonalityView.css";
import ReviewStats from "../ReviewStats";
import ProfilePic from "./ProfilePic";

const { Title, Text, Paragraph } = Typography;
const { Column } = Table;

function AffixButton(props) {
    // const [bottom, setBottom] = useState(10);

    return (
        // <Affix offsetBottom={10}>
        <Button
            style={{
                position: "fixed",
                zInex: 9999,
                bottom: "3%",
                left: "70%"
            }}
            onClick={props.createClaim}
            type="primary"
        >
            Add Claim
        </Button>
        // </Affix>
    );
}

class PersonalityView extends Component {
    constructor(props) {
        super(props);
        this.createClaim = this.createClaim.bind(this);
        this.viewClaim = this.viewClaim.bind(this);
        this.state = {};
    }

    componentDidMount() {
        const self = this;
        self.getPersonality();
    }

    getPersonality() {
        axios
            .get(
                `${process.env.API_URL}/personality/${this.props.match.params.id}`
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
        if (personality) {
            const imageStyle = {
                backgroundImage: `url(${personality.image})`
            };
            const { reviews } = personality.stats;
            return (
                <>
                    <Row style={{ padding: "0px 20px 0px 20px" }}>
                        <Col span={6}>
                            <Avatar size={90} src={personality.image} />
                        </Col>
                        <Col span={3}></Col>
                        <Col span={15}>
                            <Title level={4}>{personality.name}</Title>
                            <Paragraph ellipsis={{ rows: 1, expandable: true }}>
                                {personality.description}
                            </Paragraph>
                        </Col>
                    </Row>
                    <Divider />
                    <AffixButton createClaim={this.createClaim} />
                    <Row>
                        <Col span={6}>
                            <Row justify="end">
                                <Col span={24} flex="column">
                                    <ReviewStats dataSource={reviews} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <div style={{ width: "100%", padding: "15px" }}>
                            <Table
                                dataSource={personality.claims}
                                rowKey={record => record._id}
                            >
                                <Column
                                    width="70%"
                                    title="Title"
                                    dataIndex="title"
                                    key="title"
                                />

                                <Column
                                    title="Action"
                                    key="action"
                                    render={record => (
                                        <Button
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.viewClaim(record._id);
                                            }}
                                        >
                                            View Claim
                                        </Button>
                                    )}
                                />
                            </Table>
                        </div>
                    </Row>
                </>
            );
        } else {
            return (
                <Spin
                    tip="Loading..."
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

export default withRouter(PersonalityView);
