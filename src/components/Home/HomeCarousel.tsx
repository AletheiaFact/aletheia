import { Carousel, Col, Row } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React from 'react';

import colors from '../../styles/colors';
import CTASection from './CTASection';
import HomeCarouselStyle from './HomeCarousel.style';
import HomeStats from './HomeStats';

const HomeCarousel = ({ isLoggedIn, personalities, stats }) => {
    const { t } = useTranslation();

    return (
        <HomeCarouselStyle>
            <Col
                span={24}
                style={{
                    height: "443px",
                    overflow: "hidden",
                    position: "relative"
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        zIndex: 1,
                        backgroundColor: "rgba(0,0,0,0.6)"
                    }}
                ></div>
                <Carousel autoplay dots={false}>
                    {personalities.map(
                        (p, i) => p && (
                            <div key={i}>
                                <Image
                                    alt={t('seo:personalityImageAlt', { name: p.name })}
                                    src={p.image}
                                    width="100%"
                                    height="100%"
                                    layout="responsive"
                                    objectFit="contain"
                                    objectPosition={"center calc(443px / 2 * -1)"}
                                    style={{
                                        color: colors.white,
                                        lineHeight: "160px",
                                        textAlign: "center",
                                        width: "auto",
                                        filter: "grayscale(100%)",
                                        background: 'none',
                                    }}
                                />
                            </div>
                        )
                    )}
                </Carousel>
            </Col>
            <div
                style={{
                    position: "absolute",
                    zIndex: 2,
                    width: "100%",
                    height: "443px",
                }}
            >
                <Col
                    span={18}
                    offset={3}
                    className="carousel-container"
                >
                    <Col
                        offset={4}
                        span={16}
                        className="carousel-content"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                        }}
                    >
                        <Row className="carousel-title-container">
                            <h1
                                className="carousel-title"
                                style={{
                                    width: "100%",
                                    color: colors.white,
                                    margin: 0,
                                }}
                            >
                                {t("home:title")}
                            </h1>
                            <h2
                                className="carousel-subtitle-container"
                                style={{
                                    width: "100%",
                                    color: colors.white,
                                    margin: 0,
                                }}
                            >
                                <span className="carousel-subtitle">{t("home:subtitle0")}</span>
                                <span className="carousel-subtitle">{t("home:subtitle1")}</span>
                            </h2>
                        </Row>

                        <CTASection isLoggedIn={isLoggedIn} />

                        <HomeStats stats={stats} />
                    </Col>
                </Col>
            </div>
        </HomeCarouselStyle>
    )
}

export default HomeCarousel
