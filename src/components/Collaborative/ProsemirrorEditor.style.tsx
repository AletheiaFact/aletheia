import { AllStyledComponent } from "@remirror/styles/styled-components";
import colors from "../../styles/colors";
import styled from "styled-components";

const ProsemirrorEditorStyle = styled(AllStyledComponent)`
    background-color: ${colors.lightGray};
    border-radius: 4px;
    border: none;
    min-height: 40vh;
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;

    .ProseMirror.remirror-editor {
        min-height: 100%;
    }

    .ProseMirror.remirror-editor > p {
        margin: 0;
    }

    .remirror-editor-wrapper {
        flex: 1;
    }

    .remirror-floating-popover {
        z-index: 2;
    }
`;

export default ProsemirrorEditorStyle;