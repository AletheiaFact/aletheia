import React, { Suspense } from "react";
import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";
import Loading from "../../Loading";
import { Report } from "../../../types/Report";

const DynamicReviewTaskForm = React.lazy(
    () => import("../../ClaimReview/form/DynamicReviewTaskForm")
);
const VisualEditor = React.lazy(
    () => import("../../Collaborative/VisualEditor")
);

interface FormModeViewProps {
    dataHash: string;
    personalityId?: string;
    targetId?: string;
    editorReport?: Report | null;
}

const FormModeViewStyled = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding: 24px 32px;

    @media ${queries.sm} {
        padding: 16px;
    }
`;

const FormModeView = ({
    dataHash,
    personalityId,
    targetId,
    editorReport,
}: FormModeViewProps) => {
    return (
        <FormModeViewStyled data-cy="copilotV2FormView">
            <Suspense fallback={<Loading />}>
                <VisualEditor initialReport={editorReport} />
            </Suspense>
            <Suspense fallback={<Loading />}>
                <DynamicReviewTaskForm
                    data_hash={dataHash}
                    personality={personalityId}
                    target={targetId}
                />
            </Suspense>
        </FormModeViewStyled>
    );
};

export default FormModeView;
