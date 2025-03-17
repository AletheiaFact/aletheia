import React, { useCallback } from "react";
import { Grid } from "@mui/material"
import { Provider as CallbackTimerProvider, useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import claimApi from "../../api/claim";
import { callbackTimerInitialConfig } from "../../machines/callbackTimer/provider";
import DebateHeader from "./DebateHeader";
import DebateTimelineWrapper from "./DebateTimelineWrapper";
import { useDispatch } from "react-redux";
import actions from "../../store/actions";
import { currentNameSpace } from "../../atoms/namespace";
import { currentUserRole } from "../../atoms/currentUser";

const DebateView = ({ claim }) => {
    const debate = claim?.content;
    const { t } = useTranslation();
    const speeches = debate.content;
    const dispatch = useDispatch();
    const [nameSpace] = useAtom(currentNameSpace);
    dispatch(actions.setSelectTarget(claim));
    const [userRole] = useAtom(currentUserRole);

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
                <Grid container
                    style={{
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <DebateHeader
                        claim={claim}
                        title={claim?.title}
                        personalities={claim?.personalities}
                        userRole={userRole}
                    />
                    <Grid item
                        xs={10}
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",

                        }}
                    >
                        <DebateTimelineWrapper
                            speeches={speeches}
                            isLive={debate.isLive}
                        />
                    </Grid>
                </Grid>
            </CallbackTimerProvider>
        </>
    );
};

export default DebateView;
