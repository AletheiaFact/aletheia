import React, { useCallback } from "react";
import { Col, Row } from "antd";
import { Provider as CallbackTimerProvider, useAtom } from "jotai";
import { useTranslation } from "next-i18next";

import { isUserLoggedIn } from "../../atoms/currentUser";
import claimApi from "../../api/claim";
import { callbackTimerInitialConfig } from "../../machines/callbackTimer/provider";
import DonationCard from "../DonationCard";
import CTARegistration from "../Home/CTARegistration";
import VideoCTACard from "../VideoCTACard";
import DebateHeader from "./DebateHeader";
import DebateTimelineWrapper from "./DebateTimelineWrapper";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";

const DebateView = ({ claim }) => {
    const debate = claim?.content;
    const { t } = useTranslation();
    const speeches = debate.content;
    const [isLoggedIn] = useAtom(isUserLoggedIn);
    const dispatch = useDispatch();
    dispatch(actions.setSelectClaim(claim));

    // the new debate data will in the callbackResult of the state
    const updateTimeline = useCallback(() => {
        return claimApi.getById(claim?._id, t).then((debateClaim) => {
            return debateClaim;
        });
    }, [claim?._id, t]);

    const timerConfig = {
        stopped: !debate.isLive,
        interval: 10,
        callbackFunction: updateTimeline,
    };

    return (
        <>
            <CallbackTimerProvider
                //@ts-ignore
                initialValues={[[callbackTimerInitialConfig, timerConfig]]}
            >
                <Row
                    style={{
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <DebateHeader
                        title={claim?.title}
                        personalities={claim?.personalities}
                    />
                    <Row
                        style={{
                            padding: "30px 10%",
                            width: "100%",
                        }}
                    >
                        <DebateTimelineWrapper
                            speeches={speeches}
                            isLive={debate.isLive}
                        />
                    </Row>
                    <Row
                        style={{
                            padding: "30px 10%",
                            width: "100%",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Col>
                            <VideoCTACard />
                        </Col>
                        <Col>
                            <DonationCard />
                        </Col>
                    </Row>
                    {!isLoggedIn && (
                        <Row
                            style={{
                                padding: "30px 10%",
                                width: "100%",
                            }}
                        >
                            <Col xs={24} lg={18} order={3}>
                                <CTARegistration />
                            </Col>
                        </Row>
                    )}
                </Row>
            </CallbackTimerProvider>
        </>
    );
};

export default DebateView;
