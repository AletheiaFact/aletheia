import colors from "../../styles/colors"
import styled from "styled-components";

const CTAContainer = styled.div`
    border-radius: 4px;
    padding: 32px 0;
    margin-bottom: 45px;

    .CTA-registration-button {
        display: flex;
        margin: 0 16px;
    }

    @media (max-width: 1024px) {
        padding: 32px;

        .CTA-registration-button {
            margin: 0 auto;
            display: flex;
        }
    }

    @media (max-width: 548px) {
        margin-bottom: 22px;
        border-radius: 0;
    }
`

export default CTAContainer
