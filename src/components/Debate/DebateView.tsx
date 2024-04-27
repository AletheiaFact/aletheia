import React, { useCallback } from "react";
import { Row } from "antd";
import { Provider as CallbackTimerProvider, useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import claimApi from "../../api/claim";
import { callbackTimerInitialConfig } from "../../machines/callbackTimer/provider";
import DebateHeader from "./DebateHeader";
import DebateTimelineWrapper from "./DebateTimelineWrapper";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";
import { currentNameSpace } from "../../atoms/namespace";

const DebateView = ({ claim }) => {
    const debate = claim?.content;
    const { t } = useTranslation();
    const speeches = debate.content;
    const dispatch = useDispatch();
    const [nameSpace] = useAtom(currentNameSpace);
    dispatch(actions.setSelectClaim(claim));

    // the new debate data will in the callbackResult of the state
    const updateTimeline = useCallback(() => {
        return claimApi
            .getById(claim?._id, t, { nameSpace })
            .then((debateClaim) => {
                return debateClaim;
            });
    }, [claim?._id, nameSpace, t]);

    const timerConfig = {
        stopped: !debate.isLive,
        interval: 10,
        callbackFunction: updateTimeline,
    };

    return (
        <>
            <CallbackTimerProvider
                //@ts-ignore
                initialValues={[
                    [callbackTimerInitialConfig, timerConfig],
                    [currentNameSpace, nameSpace],
                ]}
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
                </Row>
            </CallbackTimerProvider>
        </>
    );
};

export default DebateView;
