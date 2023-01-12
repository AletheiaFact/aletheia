import { Col, Row } from "antd";
import { useAtom } from "jotai";
import React from "react";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import {
    addDebateSelector,
    addImageSelector,
    addSpeechSelector,
    stateSelector,
} from "../../../machines/createClaim/selectors";
import ClaimCollectionHeader from "../../ClaimCollection/ClaimCollectionHeader";
import Loading from "../../Loading";
import PersonalityCard from "../../Personality/PersonalityCard";
import ClaimCreate from "./ClaimCreate";
import ClaimSelectPersonality from "./ClaimSelectPersonality";
import ClaimSelectType from "./ClaimSelectType";
import ClaimUploadImage from "./ClaimUploadImage";

const CreateClaimView = () => {
    const [state] = useAtom(createClaimMachineAtom);
    const setupImage = stateSelector(state, "setupImage");
    const notStarted = stateSelector(state, "notStarted");
    const setupSpeech = stateSelector(state, "setupSpeech");
    const setupDebate = stateSelector(state, "setupDebate");
    const addImage = addImageSelector(state);
    const addSpeech = addSpeechSelector(state);
    const addDebate = addDebateSelector(state);
    const { claimData } = state.context;
    const isLoading = !(
        notStarted ||
        setupSpeech ||
        setupImage ||
        setupDebate ||
        addImage ||
        addSpeech ||
        addDebate
    );

    const CreateClaimHeader = () =>
        setupDebate ? (
            <ClaimCollectionHeader
                personalities={claimData.personality}
                title=""
            />
        ) : (
            <PersonalityCard
                personality={claimData.personality[0]}
                header={true}
                mobile={true}
            />
        );

    return (
        <Row justify="center">
            <Col span={18}>
                {claimData.personality && <CreateClaimHeader />}
                {notStarted && <ClaimSelectType />}
                {(setupSpeech || setupImage || setupDebate) && (
                    <ClaimSelectPersonality />
                )}
                {addImage && <ClaimUploadImage />}
                {addSpeech && <ClaimCreate />}
                {isLoading && <Loading />}
            </Col>
        </Row>
    );
};

export default CreateClaimView;
