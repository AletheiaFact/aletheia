import colors from "../../../styles/colors";
import styled from "styled-components";

const EditorStyle = styled.div`
    order: 1;
    margin-top: 24px;
    padding: 0 8px;

    .toolbar {
        display: flex;
        gap: 16px;
        background-color: ${colors.lightGray};
        margin-top: 0;
        justify-content: flex-end;
        flex-direction: column;
    }

    .toolbar-item,
    .toolbar-item:active,
    .toolbar-item:focus {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        width: 50px;
        gap: 8px;
        background-color: transparent;
        color: ${colors.bluePrimary};
    }

    .toolbar-item:hover {
        border: none;
        border-color: ${colors.bluePrimary};
        color: ${colors.bluePrimary};
        outline: none;
    }

    .toolbar-item:hover::after {
        content: "";
        border: 1px solid ${colors.bluePrimary};
        width: 4px;
        height: 40px;
    }

    .toolbar-item[disabled],
    .toolbar-item[disabled]:hover {
        background: ${colors.lightGray};
        border-color: ${colors.lightGray};
        color: rgba(0, 0, 0, 0.25);
    }

    .toolbar-item[disabled]:hover::after {
        content: none;
    }

    .toolbar-item-icon {
        font-size: 20px;
    }

    @media (max-width: 758px) {
        order: 0;
        width: 100%;
        border: 1px solid ${colors.graySecondary};
        border-radius: 4px;

        .toolbar {
            flex-direction: row;
            justify-content: space-between;
        }
    }
`;

export default EditorStyle;
