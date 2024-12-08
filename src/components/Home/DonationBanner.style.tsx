import styled from "styled-components";
import colors from "../../styles/colors";
import { Col } from "antd";
import { queries } from "../../styles/mediaQueries";

const DonationBannerStyle = styled(Col)`
    background-color: ${colors.inactive};

    .close-banner {
        color: ${colors.primary};
        font-size: 25px;
        align-self: flex-end;
        position: absolute;
        right: 10px;
        bottom: -10px;
        z-index: 1;
    }

    .banner-content {
        display: flex;
        margin: 25px auto;
        flex-direction: column;
        align-items: center;
        max-width: 60%;
        gap: 20px;
    }

    .banner-buttons {
        display: flex;
        gap: 30px;
    }

    .banner-content > h1 {
        width: 100%;
        color: ${colors.primary};
        font-size: 26px;
        font-weight: 800;
        text-align: center;
    }

    .banner-content > p {
        color: ${colors.black};
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        text-align: center;
    }

    .banner-button {
        font-weight: 700;
    }

    @media ${queries.md} {
        .banner-content {
            max-width: 80%;
        }
    }

    @media ${queries.xs} {
        .banner-content > h1 {
            font-size: 20px;
        }

        .banner-content > p {
            font-size: 12px;
        }

        .close-banner {
            align-self: flex-start;
            top: -10px;
        }
    }
`;

export default DonationBannerStyle;
