import colors from "../../styles/colors";
import styled from "styled-components";

const CopilotConversationSuggestionStyled = styled.div`
    background: ${colors.white};
    display: flex;
    flex-direction: column;
    border-radius: 10px;

    .suggestions-header {
        padding: 16px 8px;
        text-align: center;
        margin: 0;
        font-size: 14px;
    }

    .suggestion-card {
        padding: 16px 8px;
        cursor: pointer;
        border: none;
        border-top: 1px solid #ccc;
        background: ${colors.white};
        border-radius: 0 0 10px 10px;
        text-align: center;
        color: ${colors.lightBlueMain};
        font-weight: bold;
        font-size: 14px;
    }
`;

export default CopilotConversationSuggestionStyled;
