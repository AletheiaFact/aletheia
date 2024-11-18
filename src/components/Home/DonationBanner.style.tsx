import styled from "styled-components";
import colors from "../../styles/colors";
import { Col } from "antd";

const DonationBannerStyle = styled(Col)`
        background-color: ${colors.quartiary};

    .show-banner { 
        color: ${colors.white};
        font-size: 13px;
        border: none;
        background-color: ${colors.blackTertiary};
        font-weight: 600;
        cursor: pointer;
        align-self: flex-end;
        position: absolute;
        right: 10px;
        bottom: -25px;
        z-index: 1;
    }

    .banner-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0px;

    }

    .banner-content > h1 {
        width: 100%;
        color: ${colors.black};
        font-size: 26px;
        line-height: 34px;
        font-weight: 800;
        text-align: center;
    }

    .banner-content > p {
        color: ${colors.blackTertiary};
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        text-align: center;
    }

    .banner-button {
        font-weight: 600;
    }
`;

export default DonationBannerStyle;
