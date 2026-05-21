import Stack from "@mui/material/Stack";
import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";
import colors from "../../../styles/colors";

const HomeHeroSearchStyled = styled(Stack)`
    width: 100%;
    max-width: 720px;
    margin: 0 auto;

    .home-header-search-heading {
        width: 100%;
    }

    .home-header-search-title {
        font-size: clamp(22px, 3.5vw, 36px);
        font-weight: 700;
        line-height: 1.2;
        color: ${colors.primary};
        text-align: center;
        margin: 0;
    }

    .home-header-search-description {
        font-size: clamp(13px, 1.4vw, 16px);
        line-height: 1.5;
        color: ${colors.secondary};
        text-align: center;
        margin: 0;
    }

    .home-header-search-box {
        display: flex;
        align-items: center;
        gap: clamp(8px, 1.5vw, 12px);
        width: 100%;
        background-color: ${colors.white};
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        padding: 8px 8px 8px 20px;
    }

    .home-header-search-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: ${colors.secondary};

        svg {
            font-size: 22px;
        }
    }

    .home-header-search-input {
        flex: 1;
        font-size: clamp(15px, 1.4vw, 16px);
        color: ${colors.primary};

        input {
            padding: clamp(8px, 1.5vw, 12px) 0;
        }

        input::placeholder {
            color: ${colors.secondary};
            opacity: 1;
        }
    }

    .home-header-search-button {
        height: 44px !important;
        padding: 0 20px !important;
        border-radius: 8px !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        text-transform: none !important;
        flex-shrink: 0;
    }

    .home-header-search-button-icon {
        font-size: 18px !important;
        margin-left: 6px;
    }

    @media ${queries.sm} {
        .home-header-search-box {
            flex-wrap: wrap;
            padding: 12px;
        }

        .home-header-search-button {
            width: 100%;
        }
    }
`;

export default HomeHeroSearchStyled;
