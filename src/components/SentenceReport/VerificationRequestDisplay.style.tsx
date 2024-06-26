import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import { Row } from "antd";

const VerificationRequestCardDisplayStyle = styled(Row)`
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

export default VerificationRequestCardDisplayStyle;
