import { Row } from "antd";
import styled from "styled-components";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";

const PersonalityMinimalCardStyle = styled(Row)`
    .personality {
        text-align: center;
        width: 150px;
    }
    .personality-name {
        font-size: 16px;
        margin-top: 16px;
        color: ${colors.bluePrimary};
        font-weight: 400;
    }

    .personality-card {
        text-align: center;
        max-width: 167px;
        justify-content: center;
    }

    .personality-description-content {
        font-size: 10px;
        color: ${colors.blackSecondary};
    }

    .personality-description {
        display: block;
    }

    .personality-profile {
        color: ${colors.blackSecondary};
        text-decoration: underline;
        font-weight: 700;
    }

    @media ${queries.sm} {
        .personality-card {
            max-width: 100%;
            justify-content: start;
            align-items: start;
            padding-bottom: 10px;
        }

        .personality {
            text-align: left;
            padding-left: 15px;
            width: calc(100% - 130px);
        }

        .personality .ant-col {
            width: 100%;
        }

        .personality-name {
            font-size: 26px;
            margin-top: 0;
        }

        .personality-description-content {
            text-align: center;
            flex-wrap: wrap;
            width: 100%;
            margin-top: 16px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
        }

        .personality-description {
            display: inline;
        }
    }

    @media ${queries.xs} {
        .personality-card {
            justify-content: space-around;
            align-items: center;
        }

        .personality-description-content {
            flex-direction: column;
            align-items: flex-start;
        }
    }
`;

export default PersonalityMinimalCardStyle;
