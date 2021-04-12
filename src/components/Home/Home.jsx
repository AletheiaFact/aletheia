import React, { Component } from "react";
import CTARegistration from "./CTARegistration";
import { Button, Row, Carousel } from "antd";
import personalityApi from "../../api/personality";
import PersonalityCard from "../Personality/PersonalityCard";
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personalities: []
        };
    }
    componentDidMount() {
        personalityApi
            .getPersonalities({
                pageSize: 5,
                fetchOnly: true
            })
            .then(personalities => this.setState({ personalities }));
    }

    render() {
        const { personalities } = this.state;
        const contentStyle = {
            height: "auto",
            color: "#fff",
            lineHeight: "160px",
            textAlign: "center",
            background: "#364d79",
            width: "100%",
            filter: "grayscale(100%)"
        };
        return (
            <>
                <Row
                    style={{
                        position: "relative",
                        marginTop: "-10px"
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: "50vh",
                            overflow: "hidden",
                            position: "relative"
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "50vh",
                                position: "absolute",
                                zIndex: "1",
                                backgroundColor: "rgba(0,0,0,0.6)"
                            }}
                        ></div>
                        <Carousel autoplay dots={false}>
                            {personalities.map(
                                (p, i) =>
                                    p && (
                                        <div>
                                            <img
                                                style={contentStyle}
                                                src={p.image}
                                                key={p._id}
                                            />
                                        </div>
                                    )
                            )}
                        </Carousel>
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            zIndex: "2",
                            width: "100%",
                            height: "100%",
                            padding: "7%"
                        }}
                    >
                        <Row
                            style={{
                                height: "25%",
                                color: "#fff",
                                flexDirection: "column",
                                textAlign: "center"
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "26px"
                                }}
                            >
                                checking claims
                            </span>{" "}
                            <br />
                            <span>from your favorite personalities</span>
                        </Row>
                        <Row
                            style={{
                                height: "60%",
                                color: "#fff",

                                flexDirection: "column"
                            }}
                        >
                            <Row>
                                <p>
                                    <span
                                        style={{
                                            color: "#67BEF2",
                                            fontSize: "34px"
                                        }}
                                    >
                                        105
                                    </span>{" "}
                                    personalities
                                </p>
                            </Row>
                            <Row>
                                <p>
                                    <span
                                        style={{
                                            color: "#67BEF2",
                                            fontSize: "34px"
                                        }}
                                    >
                                        1235
                                    </span>{" "}
                                    speeches
                                </p>
                            </Row>
                            <Row>
                                <p>
                                    <span
                                        style={{
                                            color: "#67BEF2",
                                            fontSize: "34px"
                                        }}
                                    >
                                        10495
                                    </span>{" "}
                                    claims reviewed
                                </p>
                            </Row>
                        </Row>
                        <Row
                            style={{
                                height: "15%",
                                color: "#fff",
                                justifyContent: "space-between"
                            }}
                        >
                            <span>
                                contribute to an internet free of fake news
                            </span>{" "}
                            <Button>Create account</Button>
                        </Row>
                    </div>
                </Row>
                <Row>
                    {personalities.map(
                        (p, i) =>
                            p && (
                                <PersonalityCard
                                    personality={p}
                                    summarized={true}
                                    key={p._id}
                                />
                            )
                    )}
                    <Button>See more personalities</Button>
                </Row>
                <Row>
                    <CTARegistration></CTARegistration>
                </Row>
            </>
        );
    }
}

export default Home;
