import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const HomeHeaderStyle = styled.div`
    .home-header-container {
        padding: 81px 0;
        flex-direction: row;
        align-items: flex-start;
        gap: 20px;
    }

    .home-header-title > h1 {
        font-size: clamp(24px, 3vw, 40px);
    }

    .home-header-title > h2 {
        font-size: clamp(16px, 3vw, 40px);
        flex-direction: column;
    }

    .video-container {
        height: clamp(149px, 28vw, 317px);
        aspect-ratio: 16 / 9;
    }

    @media (min-width: 768px) and (max-width: 822px) {
        .home-header-title > h1 {
            font-size: clamp(24px, 3vw, 40px);
        }
    }

    @media ${queries.sm} {
        .home-header-container {
            padding: 42px 0;
            flex-direction: column;
            align-items: center;
        }

        .home-header-title > h2 {
            flex-direction: row;
        }

        .video-container {
            height: auto;
            width: clamp(320px, 76vw, 600px);
        }
    }

    @media ${queries.xs} {
        .home-header-container > div {
            max-width: 80%;
            margin: 0 auto;
        }
    }
`;

export default HomeHeaderStyle;
