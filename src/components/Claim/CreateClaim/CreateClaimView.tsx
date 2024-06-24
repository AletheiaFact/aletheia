import { Col, Row } from "antd";
import { useAtom } from "jotai";
import React, { useState } from "react";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import {
    addDebateSelector,
    addUnattributedSelector,
    addImageSelector,
    addSpeechSelector,
    stateSelector,
} from "../../../machines/createClaim/selectors";
import Loading from "../../Loading";
import ClaimCreate from "./ClaimCreate";
import ClaimCreateDebate from "./ClaimCreateDebate";
import ClaimSelectPersonality from "./ClaimSelectPersonality";
import ClaimSelectType from "./ClaimSelectType";
import ClaimUploadImage from "./ClaimUploadImage";
import { CreateClaimHeader } from "./CreateClaimHeader";
import colors from "../../../styles/colors";
import LargeDrawer from "../../LargeDrawer";
import VerificationRequestCard from "../../VerificationRequest/VerificationRequestCard";
import AletheiaButton from "../../Button";
import { DeleteOutlined } from "@ant-design/icons";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import verificationRequestApi from "../../../api/verificationRequestApi";
import { useTranslation } from "next-i18next";

const CreateClaimView = () => {
    const { t } = useTranslation();
    const [state, send] = useAtom(createClaimMachineAtom);
    const setupImage = stateSelector(state, "setupImage");
    const notStarted = stateSelector(state, "notStarted");
    const setupSpeech = stateSelector(state, "setupSpeech");
    const setupDebate = stateSelector(state, "setupDebate");
    const addImage = addImageSelector(state);
    const addSpeech = addSpeechSelector(state);
    const addDebate = addDebateSelector(state);
    const addUnattributed = addUnattributedSelector(state);

    const showPersonality = addSpeech || addImage || addDebate;
    const { claimData } = state.context;
    const isLoading = !(
        notStarted ||
        setupSpeech ||
        setupImage ||
        setupDebate ||
        addImage ||
        addSpeech ||
        addDebate ||
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
            .removeVerificationRequestFromGroup(id, {
                group: claimData.group._id,
            })
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
                        <span
                            onClick={() => setOpen(true)}
                            role="button"
                            aria-pressed="false"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === "Space") {
                                    setOpen(true);
                                    e.preventDefault();
                                }
                            }}
                            style={{
                                color: colors.lightBlueMain,
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            {t(
                                "verificationRequest:manageVerificationRequests"
                            )}
                        </span>
                    )}
                {showPersonality && !!claimData.personalities?.length && (
                    <CreateClaimHeader claimData={claimData} />
                )}
                {notStarted && <ClaimSelectType />}
                {(setupSpeech || setupImage || setupDebate) && (
                    <ClaimSelectPersonality />
                )}
                {addImage && <ClaimUploadImage />}
                {addSpeech && <ClaimCreate />}
                {addDebate && <ClaimCreateDebate />}
                {isLoading && <Loading />}
                {addUnattributed && <ClaimCreate />}
            </Col>

            <LargeDrawer
                open={open}
                onClose={onCloseDrawer}
                backgroundColor={colors.lightGraySecondary}
            >
                <Col style={{ margin: "32px 64px" }}>
                    <h3>{t("verificationRequest:verificationRequestTitle")}</h3>
                    {claimData?.group ? (
                        claimData.group.content.map(({ _id, content }) => (
                            <VerificationRequestCard
                                key={_id}
                                content={content}
                                actions={[
                                    <AletheiaButton
                                        key="remove"
                                        onClick={() => onRemove(_id)}
                                        loading={isLoading}
                                    >
                                        <DeleteOutlined />
                                    </AletheiaButton>,
                                ]}
                            />
                        ))
                    ) : (
                        <></>
                    )}
                </Col>
            </LargeDrawer>
        </Row>
    );
};

export default CreateClaimView;
