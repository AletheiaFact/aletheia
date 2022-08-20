import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const HomeContentStyle = styled.div`
    .more-personalities-container {
        margin: 48px 0 64px 0;
    }

    .join-container-logged-out {
        margin-left: 20px;
    }

    @media ${queries.lg} {
        .ant-col-10.personality-card-content {
            flex: 0 0 80px;
        }
    }

    @media ${queries.md} {
        .main-content {
            display: grid;
            grid-template-columns: 1fr;
        }

        .ant-col-12.personalities-container {
            display: block;
            flex: 0 0 50%;
            max-width: 75%;
        }

        .more-personalities-container {
            margin: 16px 0 32px 0;
        }

        .join-container-logged-out {
            margin-left: 0;
            max-width: 100%;
        }
        /*
        .CTA-registration-container,
        .section-title-container {
            margin-left: 12.5%;
            max-width: 75%;
        } */

        .ant-col-12.personalities-container,
        .CTA-registration-container,
        .section-title-container {
            margin-left: 8.33333333%;
            max-width: 83.333334%;
        }
    }

    @media ${queries.sm} {
        .ant-col-12.personalities-container,
        .CTA-registration-container,
        .section-title-container {
            margin-left: 4.16666667%;
            max-width: 91.666666%;
        }
    }

    @media ${queries.xs} {
        .section-title-container {
            margin-left: 4.16666667%;
            max-width: 91.666666%;
        }

        .CTA-registration-container,
        .join-container-logged-in {
            margin-left: 0;
            max-width: 100%;
        }
    }
`;

export default HomeContentStyle;
