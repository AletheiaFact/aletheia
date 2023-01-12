import { Col, Row } from "antd";
import { useAtom } from "jotai";
import React from "react";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import {
    addImageSelector,
    addSpeechSelector,
    notStartedSelector,
    setupImageSelector,
    setupSpeechSelector,
} from "../../../machines/createClaim/selectors";
import Loading from "../../Loading";
import PersonalityCard from "../../Personality/PersonalityCard";
import ClaimCreate from "./ClaimCreate";
import ClaimSelectPersonality from "./ClaimSelectPersonality";
import ClaimSelectType from "./ClaimSelectType";
import ClaimUploadImage from "./ClaimUploadImage";

const CreateClaimView = () => {
    const [state] = useAtom(createClaimMachineAtom);
    const notStarted = notStartedSelector(state);
    const setupSpeech = setupSpeechSelector(state);
    const setupImage = setupImageSelector(state);
    const addImage = addImageSelector(state);
    const addSpeech = addSpeechSelector(state);
    const { claimData } = state.context;
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
                        personality={claimData.personality[0]}
                        header={true}
                        mobile={true}
                    />
                )}
                {notStarted && <ClaimSelectType />}
                {(setupSpeech || setupImage) && <ClaimSelectPersonality />}
                {addImage && <ClaimUploadImage />}
                {addSpeech && <ClaimCreate />}
                {isLoading && <Loading />}
            </Col>
        </Row>
    );
};

export default CreateClaimView;
