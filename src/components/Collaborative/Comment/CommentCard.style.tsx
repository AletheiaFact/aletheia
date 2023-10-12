import styled from "styled-components";
import colors from "../../../styles/colors";

const CommentCardStyle = styled.div`
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid #eeeeee;
    box-sizing: border-box;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 16px;
    height: auto;
    gap: 16px;
    cursor: pointer;
    transition: transform 0.3s;
    transform: ${(props) =>
        props.isselected === "true" ? `translateX(-15px)` : `translateX(0)`};

    &:hover {
        box-shadow: 0px 3px 3px 1px rgba(0, 0, 0, 0.2);

        .comment-card-actions-resolve-button {
            display: block;
        }
    }

    .comment-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .comment-card-header-info {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    }

    .comment-card-header-info-avatar {
        margin: 0;
        background: ${colors.blueQuartiary};
        width: 32px;
        height: 32px;
        font-size: 16px;
        padding-top: 4px;
    }

    .comment-card-actions,
    .comment-card-form-actions {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .comment-card-form {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 16px;
    }

    .comment-card-actions-resolve-button {
        display: none;
    }
`;

export default CommentCardStyle;
