import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import React, { useContext } from "react";
import { GlobalStateMachineContext } from "../../Context/GlobalStateMachineProvider";
import { crossCheckingSelector } from "../../machine/selectors";

import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import CTARegistration from "../Home/CTARegistration";
import SentenceReportContent from "./SentenceReportContent";

const SentenceReportView = ({ personality, claim, context }) => {
    const { isLoggedIn } = useAppSelector((state) => {
        return {
            isLoggedIn: state?.login,
        };
    });
    const { machineService } = useContext(GlobalStateMachineContext);
    const isCrossChecking = useSelector(machineService, crossCheckingSelector);

    return (
        <div>
            <Row>
                <Col
                    offset={3}
                    span={18}
                    style={
                        isCrossChecking && {
                            backgroundColor: colors.lightGray,
                            padding: "15px",
                        }
                    }
                >
                    <Col>
                        <SentenceReportContent
                            context={context}
                            personality={personality}
                            claim={claim}
                        />
                    </Col>
                    {!isLoggedIn && <CTARegistration />}
                </Col>
            </Row>
        </div>
    );
};

export default SentenceReportView;
