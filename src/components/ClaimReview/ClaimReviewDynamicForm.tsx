import { Row } from 'antd'
import React from 'react'
import { useMachine } from "@xstate/react";
import { reviewTaskMachine } from "../../machine/reviewTaskMachine"
import ClaimReviewForm from './ClaimReviewForm'
import ClaimReviewUserForm from './ClaimReviewUserForm'
import api from '../../api/claimReviewTask'
import { useTranslation } from 'next-i18next';

const ClaimReviewDynamicForm = ({ personality, claim, sentence, sitekey, handleReviewFinished }) => {
    const [state, send, service] = useMachine(reviewTaskMachine)
    const personalityId = personality._id;
    const claimId = claim._id;
    const sentenceHash = sentence?.props["data-hash"];
    const { t } = useTranslation();


    service.onTransition(transitionState => {
        try {
            const reviewTaskData = {
                state: transitionState.value,
                context: transitionState.context
            }
            localStorage.setItem("stored-state", JSON.stringify(reviewTaskData))
            if (transitionState.value !== "unassigned") {
                api.createClaimReviewTask(reviewTaskData, t)
            }

        } catch (e) {
            console.error("Unable to save to localStorage")
        }
    })

    return (
        <>
            {state.matches("unassigned") &&
                <ClaimReviewUserForm sentenceHash={sentenceHash} send={send} />
            }
            <p>{state.value}</p>
            {state.matches("assigned") && (
                <Row>
                    <ClaimReviewForm
                        claimId={claimId}
                        personalityId={personalityId}
                        handleOk={handleReviewFinished}
                        handleCancel={handleReviewFinished}
                        highlight={sentence}
                        sitekey={sitekey}
                    />
                </Row>
            )}
        </>)
}

export default ClaimReviewDynamicForm
