import styled from "styled-components";
import { queries } from "../styles/mediaQueries";

const SocialMediaShareStyle = styled.div`
    margin-bottom: 32px;
    display: flex;
    border-radius: 0;
    flex-direction: column;

    .social-media-container {
        margin-left: 32px;
        height: 39px;
        margin: 0 auto;
        margin-top: 16px;
    }

    .social-media-list {
        justify-content: center;
    }

    &.logged-out {
        display: grid;
        border-radius: 10px;
        grid-template-columns: 1fr;

        .social-media-container {
            width: 276px;
            margin: 0 auto;
            margin-top: 16px;
        }

        @media ${queries.md} {
            display: flex;
            align-items: center;
            justify-content: center;

            .social-media-container {
                width: auto;
                margin: 0;
                margin-left: 32px;
            }
        }
    }

    @media ${queries.xs} {
        margin-bottom: 16px;
        border-radius: 0;
        display: grid;
        grid-template-columns: 1fr;

        .social-media-container {
            margin: 0 auto;
            margin-top: 16px;
        }
    }
`;
export default SocialMediaShareStyle;
