import { Col, Row, Typography } from "antd";
import React, { useContext, useLayoutEffect, useState } from "react";

import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import PersonalityCard from "../Personality/PersonalityCard";
import { GlobalStateContext } from "../Editor/CallbackTimerProvider";
import { useActor } from "@xstate/react";
import personalityApi from "../../api/personality";
import { useTranslation } from "next-i18next";

const { Title } = Typography;
const ClaimCollectionHeader = ({ title, personalities }) => {
    const [personalitiesArray, setPersonalitiesArray] = useState(personalities);
    const { t } = useTranslation();
    const { timerService } = useContext<any>(GlobalStateContext);
    const [state]: any = useActor<any>(timerService);

    useLayoutEffect(() => {
        if (personalitiesArray) {
            Promise.all(
                personalitiesArray.map(async (p) => {
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
    }, [state]);

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

export default ClaimCollectionHeader;
