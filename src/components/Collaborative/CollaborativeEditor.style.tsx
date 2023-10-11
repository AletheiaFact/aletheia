import { AllStyledComponent } from "@remirror/styles/styled-components";
import colors from "../../styles/colors";
import styled from "styled-components";

const CollaborativeEditorStyle = styled(AllStyledComponent)`
    background-color: ${colors.lightGray};
    border-radius: 4px;
    border: none;
    min-height: 40vh;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;

    .remirror-editor-wrapper {
        width: calc(100% - 90px);
    }
`;

export default CollaborativeEditorStyle;
