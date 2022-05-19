import { Row } from 'antd'
import React from 'react'
import { useMachine } from "@xstate/react";
import { reviewTaskMachine } from "../../machine/reviewTaskMachine"
import ClaimReviewForm from './ClaimReviewForm'
import ClaimReviewUserForm from './ClaimReviewUserForm'

const ClaimReviewDynamicForm = ({ personality, claim, sentence, sitekey, handleReviewFinished }) => {
    const [state, send, service] = useMachine(reviewTaskMachine)
    const personalityId = personality._id;
    const claimId = claim._id;
    const sentenceHash = sentence?.props["data-hash"];


    service.onTransition(transitionState => {
        try {
            const reviewTaskData = {
                state: transitionState.value,
                context: transitionState.context
            }
            localStorage.setItem("stored-state", JSON.stringify(reviewTaskData))
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
