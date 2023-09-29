import { AllStyledComponent } from "@remirror/styles/styled-components";
import colors from "../../styles/colors";
import styled from "styled-components";

const CollaborativeEditorStyle = styled(AllStyledComponent)`
    background-color: ${colors.lightGray};
    border-radius: 4px;
    border: none;
    min-height: 40vh;
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    gap: 16px;

    .remirror-editor-wrapper {
        width: 100%;
    }
`;

export default CollaborativeEditorStyle;
