import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const CTAFolderStyle = styled.div`
    border-radius: 4px;
    padding: 32px;
    margin-bottom: 45px;

    .CTA-registration-button {
        margin: 0 auto;
    }

    @media ${queries.xs} {
        margin-bottom: 22px;
    }
`;

export default CTAFolderStyle;
