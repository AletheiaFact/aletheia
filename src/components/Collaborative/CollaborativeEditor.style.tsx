import { AllStyledComponent } from "@remirror/styles/styled-components";
import styled from "styled-components";

const CollaborativeEditorStyle = styled(AllStyledComponent)`
    background-color: #fff;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: none;
    min-height: 2rem;
    width: 100%;
    padding: 10px;

    ::placeholder {
        color: #515151;
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    }

    :active {
        border: none;
    }

    :hover {
        border: none;
    }

    :focus-visible {
        outline: none;
    }
`;

export default CollaborativeEditorStyle;
