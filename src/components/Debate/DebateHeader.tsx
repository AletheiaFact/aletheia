import { Col, Row, Typography } from "antd";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useLayoutEffect, useState } from "react";

import personalityApi from "../../api/personality";
import { callbackTimerAtom } from "../../machines/callbackTimer/provider";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import PersonalityCard from "../Personality/PersonalityCard";

const { Title } = Typography;
const DebateHeader = ({ title, personalities }) => {
    const [personalitiesArray, setPersonalitiesArray] = useState(personalities);
    const { t } = useTranslation();
    const [state] = useAtom(callbackTimerAtom);

    useLayoutEffect(() => {
        if (personalities) {
            Promise.all(
                personalities.map(async (p) => {
                    if (p && p._id) {
                        return personalityApi.getPersonality(p?._id, {}, t);
                    } else {
                        throw Error;
                    }
                })
            )
                .then((newPersonalitiesArray) => {
                    setPersonalitiesArray(newPersonalitiesArray);
                })
                .catch(() => {});
        }
    }, [state, personalities]);

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
                {personalitiesArray
                    ? personalitiesArray.map((p, index) => (
                          <Col
                              style={{
                                  display: "flex",
                                  height: "100%",
                                  padding: "30px 0px",
                                  width: "40%",
                              }}
                              key={p?._id || index}
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

export default DebateHeader;
