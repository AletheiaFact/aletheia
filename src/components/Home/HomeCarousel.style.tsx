import { Row } from "antd";
import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const HomeCarouselStyle = styled(Row)`
    .ant-carousel .slick-slider {
        background: #222;
    }

    .slick-slide > div > div > span {
        min-height: 443px;
    }

    .carousel-title-container {
        margin: 64px 0 32px 0;
    }

    .carousel-title,
    .carousel-subtitle-container {
        font-size: 40px;
        line-height: 48px;
    }

    .carousel-subtitle {
        display: block;
    }

    .CTA-container {
        display: grid;
        grid-template-rows: 52px 72px;
        width: 100%;
    }

    .CTA-title {
        font-size: 16px;
    }

    .stats-container {
        flex-direction: row;
        height: 55px;
    }

    .number-stats {
        font-size: 40px;
        line-height: 55px;
    }

    .title-stats {
        font-size: 20px;
    }

    @media ${queries.xl} {
        .CTA-container .ant-col-14 {
            max-width: 100%;
        }
    }

    @media ${queries.lg} {
        .carousel-title-container {
            margin: 32px 0 16px 0;
        }

        .CTA-container {
            order: 3;
            display: flex;
        }

        .stats-container {
            order: 2;
            flex-direction: column;
            margin: 0 0 16px 0;
            height: auto;
        }

        .ant-col-7.stats-child-container {
            max-width: 100%;
            margin-left: 0;
        }
    }

    @media ${queries.md} {
        .ant-col-offset-4.carousel-content {
            margin-left: 12.5%;
            max-width: 75%;
        }

        .carousel-container {
            max-width: 80%;
            margin-left: 10%;
        }

        .carousel-title,
        .carousel-subtitle-container {
            font-size: 36px;
            line-height: 42px;
        }

        .CTA-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    @media ${queries.sm} {
        .ant-col-offset-4.carousel-content {
            margin: 4.16666667%;
            max-width: 91.666666%;
        }
    }

    @media ${queries.xs} {
        .CTA-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr;
        }

        .CTA-container .ant-col-14 {
            max-width: 100%;
        }

        .CTA-button-container {
            display: flex;
            justify-content: flex-end;
            width: 100%;
        }

        .ant-col-offset-4.carousel-content {
            max-width: 100%;
        }

        .carousel-title-container {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .carousel-title,
        .carousel-subtitle-container {
            text-align: center;
            font-size: 16px;
            line-height: 38px;
        }

        .carousel-title {
            font-size: 26px;
        }

        .carousel-subtitle-container {
            width: 100%;
        }

        .carousel-subtitle {
            display: inline;
        }

        .stats-container,
        .CTA-button-container {
            margin-bottom: 32px;
        }

        .number-stats {
            font-size: 34px;
        }

        .title-stats {
            font-size: 16px;
        }

        .CTA-title {
            font-size: 12px;
            font-weight: 700;
        }
    }
`;

export default HomeCarouselStyle;
