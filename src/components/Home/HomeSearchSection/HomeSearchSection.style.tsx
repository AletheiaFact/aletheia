import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";
import colors from "../../../styles/colors";
import { Box } from "@mui/material";

const HomeSearchSectionStyled = styled(Box)`
    background-color: ${colors.lightNeutral};
    padding: clamp(40px, 6vw, 80px) clamp(16px, 2vw, 24px);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(24px, 3vw, 40px);

    .home-header-search-content {
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 720px;
        margin: 0 auto;
    }

    .home-header-search-heading {
        flex-direction: column;
        align-items: center;
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
        height: 44px;
        padding: 0 20px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        text-transform: none;
        flex-shrink: 0;
    }

    .home-header-search-button-icon {
        font-size: 18px;
        margin-left: 6px;
    }

    .home-feed-list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        width: 100%;
    }

    .home-feed-item {
        display: flex;
        flex-direction: column;
        width: calc(33% - 6px);
    }

    @media ${queries.md} {
        .home-feed-item {
            width: calc(50% - 6px);
        }
    }

    @media ${queries.sm} {
        .home-header-search-box {
            flex-wrap: wrap;
            padding: 12px;
        }

        .home-header-search-button {
            width: 100%;
        }

        .home-feed-item {
            width: 100%;
        }
    }
`;

export default HomeSearchSectionStyled;
