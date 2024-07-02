import styled from "styled-components";

const KanbanViewStyled = styled.div`
    display: flex;
    padding: 16px 0 32px 0;
    height: 100%;
    align-items: center;
    flex-direction: column;
    gap: 8px;

    .kanban-toolbar {
        flex-wrap: nowrap;
        width: 100%;
        padding: 1vh 5vh 0vh 5vh;
    }

    .kanban-board {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow-x: auto;
        gap: 12px;
    }
`;

export default KanbanViewStyled;
