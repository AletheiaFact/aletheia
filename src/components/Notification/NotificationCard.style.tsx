import styled from "styled-components";
import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";

const NotificationCardStyle = styled.div`
    background-color: ${({ isSeen }) =>
        !isSeen ? colors.lightGray : colors.white};
    padding: ${(props) => (!props.isSeen ? "16px 16px 16px 6px" : "16px")};
    border: 1px solid rgb(238, 238, 238);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px;
    gap: 16px;

    .container {
        width: 100%;
        display: grid;
        grid-template-columns: 32px 4fr 60px;
        justify-content: space-between;
        align-items: center;
        gap: ${(props) => (!props.isSeen ? "24px" : "16px")};
    }

    .notification-avatar {
        display: flex;
        gap: 4px;
        align-items: center;
    }

    .notification-avatar-icon {
        color: ${({ namespace }) =>
            namespace === NameSpaceEnum.Main
                ? colors.bluePrimary
                : colors.blueSecondary};
        margin: 0px;
        width: 32px;
        height: 32px;
    }

    .notification-content {
        margin: 0px;
        font-size: 12px;
        text-align: left;
        width: 100%;
    }

    .notification-time {
        color: ${colors.graySecondary};
        width: 100%;
        max-width: 40px;
        font-size: 14px;
        text-align: right;
    }

    .actions-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;

export default NotificationCardStyle;
