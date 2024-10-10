import React, { useCallback } from "react";
import { Row } from "antd";
import { Provider as CallbackTimerProvider, useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import claimApi from "../../api/claim";
import { callbackTimerInitialConfig } from "../../machines/callbackTimer/provider";
import InterviewHeader from "./InterviewHeader";
import InterviewTimelineWrapper from "./InterviewTimelineWrapper";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";
import { currentNameSpace } from "../../atoms/namespace";

const InterviewView = ({ claim }) => {
    const interview = claim?.content;
    const { t } = useTranslation();
    const speeches = interview.content;
    const dispatch = useDispatch();
    const [nameSpace] = useAtom(currentNameSpace);
    dispatch(actions.setSelectTarget(claim));

    // the new interview data will in the callbackResult of the state
    const updateTimeline = useCallback(() => {
        return claimApi
            .getById(claim?._id, t, { nameSpace })
            .then((interviewClaim) => {
                return interviewClaim;
            });
    }, [claim?._id, nameSpace, t]);

    const timerConfig = {
        stopped: !interview.isLive,
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
                    <InterviewHeader
                        title={claim?.title}
                        personalities={claim?.personalities}
                    />
                    <Row
                        style={{
                            padding: "30px 10%",
                            width: "100%",
                        }}
                    >
                        <InterviewTimelineWrapper
                            speeches={speeches}
                            isLive={interview.isLive}
                        />
                    </Row>
                </Row>
            </CallbackTimerProvider>
        </>
    );
};

export default InterviewView;
