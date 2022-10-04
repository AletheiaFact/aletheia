import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const HomeHeaderStyle = styled.div`
    .home-header-container {
        padding: 81px 0;
        flex-direction: row;
        align-items: flex-start;
        gap: 20px;
    }

    h2 {
        flex-direction: column;
    }

    .video-container {
        height: clamp(149px, 28vw, 317px);
        aspect-ratio: 16 / 9;
    }

    @media ${queries.sm} {
        .home-header-container {
            padding: 42px 0;
            flex-direction: column;
            align-items: center;
        }

        h2 {
            flex-direction: row;
        }

        .video-container {
            height: auto;
            width: clamp(320px, 76vw, 600vw);
        }
    }
`;

export default HomeHeaderStyle;
