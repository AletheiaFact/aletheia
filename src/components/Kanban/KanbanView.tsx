import { Col } from "antd";
import React, { useMemo, useState } from "react";

import { ReviewTaskStates } from "../../machines/reviewTask/enums";
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
    // Don't show unassigned, rejected, selectCrossChecker and selectReviewer column
    // because we don't save tasks in these states
    const states = useMemo(
        () =>
            Object.keys(ReviewTaskStates).filter(
                (state) =>
                    state !== ReviewTaskStates.unassigned &&
                    state !== ReviewTaskStates.selectCrossChecker &&
                    state !== ReviewTaskStates.selectReviewer &&
                    state !== ReviewTaskStates.addCommentCrossChecking &&
                    state !== ReviewTaskStates.rejected
            ),
        []
    );

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
