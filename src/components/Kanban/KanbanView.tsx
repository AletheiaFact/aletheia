import { Col } from "antd";
import React, { useMemo, useState } from "react";

import {
    KanbanClaimState,
    KanbanSourceState,
    KanbanVerificationRequestStates,
    ReviewTaskStates,
    ReviewTaskTypeEnum,
} from "../../machines/reviewTask/enums";
import KanbanCol from "./KanbanCol";
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
            <Col span={23} className="kanban-board">
                {states.map((state) => (
                    <KanbanCol
                        key={state}
                        nameSpace={nameSpace}
                        state={ReviewTaskStates[state]}
                        filterUser={filterUserTasks}
                        reviewTaskType={reviewTaskType}
                    />
                ))}
            </Col>
        </KanbanViewStyled>
    );
};

export default KanbanView;
