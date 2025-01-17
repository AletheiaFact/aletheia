import { Grid } from "@mui/material";
import React, { useState } from "react";

import {
    KanbanClaimState,
    KanbanSourceState,
    KanbanVerificationRequestStates,
    ReviewTaskStates,
    ReviewTaskTypeEnum,
} from "../../machines/reviewTask/enums";
import KanbanGrid from "./KanbanGrid";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import KanbanViewStyled from "./KanbanView.style";
import KanbanToolbar from "./KanbanToolbar";

const KanbanView = ({ reviewTaskType }) => {
    const [nameSpace] = useAtom(currentNameSpace);
    const [filterUserTasks, setFilterUserTasks] = useState({
        assigned: false,
        crossChecked: false,
        reviewed: false,
    });
    const kanbanStates = {
        [ReviewTaskTypeEnum.Claim]: KanbanClaimState,
        [ReviewTaskTypeEnum.Source]: KanbanSourceState,
        [ReviewTaskTypeEnum.VerificationRequest]:
            KanbanVerificationRequestStates,
    };

    const states = Object.keys(kanbanStates[reviewTaskType]);

    return (
        <KanbanViewStyled>
            <KanbanToolbar
                filterUserTasks={filterUserTasks}
                setFilterUserTasks={setFilterUserTasks}
            />
            <Grid container xs={11.5} justifyContent="center" className="kanban-board">
                {states.map((state) => (
                    <KanbanGrid
                        key={state}
                        nameSpace={nameSpace}
                        state={ReviewTaskStates[state]}
                        filterUser={filterUserTasks}
                        reviewTaskType={reviewTaskType}
                    />
                ))}
            </Grid>
        </KanbanViewStyled>
    );
};

export default KanbanView;
