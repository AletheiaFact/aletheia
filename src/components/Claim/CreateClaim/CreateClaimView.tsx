import { Col, Row } from "antd";
import { useAtom } from "jotai";
import React, { useState } from "react";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import {
    addDebateSelector,
    addInterviewSelector,
    addUnattributedSelector,
    addImageSelector,
    addSpeechSelector,
    stateSelector,
} from "../../../machines/createClaim/selectors";
import Loading from "../../Loading";
import ClaimCreate from "./ClaimCreate";
import ClaimCreateDebate from "./ClaimCreateDebate";
import ClaimCreateInterview from "./ClaimCreateInterview";
import ClaimSelectPersonality from "./ClaimSelectPersonality";
import ClaimSelectType from "./ClaimSelectType";
import ClaimUploadImage from "./ClaimUploadImage";
import { CreateClaimHeader } from "./CreateClaimHeader";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import verificationRequestApi from "../../../api/verificationRequestApi";
import { useTranslation } from "next-i18next";
import VerificationRequestDrawer from "../../VerificationRequest/VerificationRequestDrawer";
import ManageVerificationRequestGroup from "../../VerificationRequest/ManageVerificationRequestGroup";

const CreateClaimView = () => {
    const { t } = useTranslation();
    const [state, send] = useAtom(createClaimMachineAtom);
    const setupImage = stateSelector(state, "setupImage");
    const notStarted = stateSelector(state, "notStarted");
    const setupSpeech = stateSelector(state, "setupSpeech");
    const setupDebate = stateSelector(state, "setupDebate");
    const setupInterview = stateSelector(state, "setupInterview");
    const addImage = addImageSelector(state);
    const addSpeech = addSpeechSelector(state);
    const addDebate = addDebateSelector(state);
    const addInterview = addInterviewSelector(state);
    const addUnattributed = addUnattributedSelector(state);

    const showPersonality = addSpeech || addImage || addDebate || addInterview;
    const { claimData } = state.context;
    const isLoading = !(
        notStarted ||
        setupSpeech ||
        setupImage ||
        setupDebate ||
        setupInterview ||
        addImage ||
        addSpeech ||
        addDebate ||
        addInterview ||
        addUnattributed
    );

    const [open, setOpen] = useState(false);
    const onCloseDrawer = () => {
        setOpen(false);
    };

    const onRemove = (id) => {
        //TODO: Show confirmation dialog
        const contentGroup = claimData.group.content.filter(
            (verificationRequest) => verificationRequest?._id !== id
        );
        verificationRequestApi
            .removeVerificationRequestFromGroup(
                id,
                {
                    group: claimData.group._id,
                },
                t
            )
            .then(() => {
                send({
                    type: CreateClaimEvents.updateGroup,
                    claimData: {
                        group: { ...claimData.group, content: contentGroup },
                    },
                });
            });
    };

    return (
        <Row justify="center">
            <Col span={18} style={{ marginTop: 32 }}>
                {!isLoading &&
                    claimData?.group &&
                    claimData?.group?.content?.length > 0 && (
                        <ManageVerificationRequestGroup
                            label={t(
                                "verificationRequest:manageVerificationRequests"
                            )}
                            openDrawer={() => setOpen(true)}
                        />
                    )}
                {showPersonality && !!claimData.personalities?.length && (
                    <CreateClaimHeader claimData={claimData} />
                )}
                {notStarted && <ClaimSelectType />}
                {(setupSpeech || setupImage || setupDebate || setupInterview) && (
                    <ClaimSelectPersonality />
                )}
                {addImage && <ClaimUploadImage />}
                {addSpeech && <ClaimCreate />}
                {addDebate && <ClaimCreateDebate />}
                {addInterview && <ClaimCreateInterview />}
                {isLoading && <Loading />}
                {addUnattributed && <ClaimCreate />}
            </Col>

            <VerificationRequestDrawer
                groupContent={claimData.group.content}
                open={open}
                isLoading={isLoading}
                onCloseDrawer={onCloseDrawer}
                onRemove={onRemove}
            />
        </Row>
    );
};

export default CreateClaimView;
