import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import { Row } from "antd";

const VerificationRequestDisplayStyle = styled(Row)`
    display: flex;
    gap: 16px;

    .cta-create-claim {
        display: flex;
        gap: 32px;
        align-items: center;
        margin-bottom: 32px;
    }

    @media ${queries.sm} {
        .cta-create-claim {
            gap: 16px;
            flex-direction: column;
        }
    }
`;

export default VerificationRequestDisplayStyle;
