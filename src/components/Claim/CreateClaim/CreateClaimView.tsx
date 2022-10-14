import { useSelector } from "@xstate/react";
import { Col, Row } from "antd";
import React, { useContext } from "react";

import { CreateClaimMachineContext } from "../../../Context/CreateClaimMachineProvider";
import {
    notStartedSelector,
    setupSpeechSelector,
    setupImageSelector,
    addImageSelector,
    claimDataSelector,
    addSpeechSelector,
} from "../../../machines/createClaim/selectors";
import PersonalityCard from "../../Personality/PersonalityCard";
import ClaimUploadImage from "./ClaimUploadImage";
import ClaimCreate from "./ClaimCreate";
import ClaimSelectPersonality from "./ClaimSelectPersonality";
import ClaimSelectType from "./ClaimSelectType";
import Loading from "../../Loading";

const CreateClaimView = ({ sitekey }) => {
    const { machineService } = useContext(CreateClaimMachineContext);
    const notStarted = useSelector(machineService, notStartedSelector);
    const setupSpeech = useSelector(machineService, setupSpeechSelector);
    const setupImage = useSelector(machineService, setupImageSelector);
    const addImage = useSelector(machineService, addImageSelector);
    const addSpeech = useSelector(machineService, addSpeechSelector);
    const claimData = useSelector(machineService, claimDataSelector);
    const isLoading = !(
        notStarted ||
        setupSpeech ||
        setupImage ||
        addImage ||
        addSpeech
    );

    return (
        <Row justify="center">
            <Col span={18}>
                {claimData.personality && (
                    <PersonalityCard
                        personality={claimData.personality}
                        header={true}
                        mobile={true}
                    />
                )}
                {notStarted && <ClaimSelectType />}
                {(setupSpeech || setupImage) && <ClaimSelectPersonality />}
                {addImage && <ClaimUploadImage />}
                {addSpeech && <ClaimCreate sitekey={sitekey} />}
                {isLoading && <Loading />}
            </Col>
        </Row>
    );
};

export default CreateClaimView;
