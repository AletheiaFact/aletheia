import colors from "../../styles/colors";
import styled from "styled-components";

const EditorStyle = styled.div`
    .toolbar {
        display: flex;
        gap: 8;
        border-top: 1px solid ${colors.grayTertiary};
        border-bottom: 1px solid ${colors.grayTertiary};
        background-color: ${colors.lightGray};
        padding: 4;
        margin-top: 0;
        justify-content: flex-end;
    }

    .toolbar-item {
        border-width: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: auto;
        border-radius: 4px;
        padding: 0 12px;
        background-color: transparent;
        border: 1px solid transparent;
    }

    .toolbar-item-icon {
        font-size: 20px;
    }
`;

export default EditorStyle;
