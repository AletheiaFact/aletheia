import { Col, Row, Typography } from "antd";
import React from "react";

import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import PersonalityCard from "../Personality/PersonalityCard";

const { Title } = Typography;
const ClaimCollectionHeader = ({ title, personalities }) => {
    const { vw } = useAppSelector((state) => state);
    return (
        <Row
            className="home-header-container"
            justify="center"
            style={{
                paddingTop: "32px",
                backgroundColor: colors.lightGray,
            }}
        >
            <div
                style={{
                    backgroundColor: colors.bluePrimary,
                    color: colors.white,
                    width: vw?.sm ? "100%" : "55%",
                    justifyContent: "space-between",
                    padding: "18px 18px",
                    marginRight: "auto",
                    position: "relative",
                    // top: statsHeight / -2,
                    display: "flex",
                    gap: "2vw",
                }}
            >
                <Title
                    style={{
                        color: colors.white,
                        margin: 0,
                        fontSize: vw?.sm || vw?.xs ? "25px" : "38px",
                    }}
                >
                    {title}
                </Title>
            </div>
            <Row
                style={{
                    justifyContent: "space-evenly",
                }}
            >
                {personalities
                    ? personalities.map((p) => (
                          <Col
                              style={{
                                  display: "flex",
                                  height: "100%",
                                  padding: "30px 0px",
                                  width: "40%",
                              }}
                          >
                              <PersonalityCard
                                  personality={p}
                                  header={true}
                                  fullWidth={true}
                                  hoistAvatar={true}
                                  style={{
                                      justifyContent: "center",
                                  }}
                              />
                          </Col>
                      ))
                    : null}
            </Row>
        </Row>
    );
};

export default ClaimCollectionHeader;
