import { Col } from "antd";
import React from "react";
import CTASection from "../CTA/CTASection";
import HomeHeaderStyle from "./HomeHeader.style";
import HomeHeaderTitle from "./HomeHeaderTitle";
import HomeStats from "../HomeStats";
import HomeHeaderSearch from "./HomeHeaderSearch";

const HomeHeader = ({ stats }) => {
    return (
        <HomeHeaderStyle>
            <Col
                xxl={12}
                lg={16}
                sm={18}
                xs={24}
                className="home-header-content"
            >
                <HomeHeaderTitle />
                <CTASection />
            </Col>
            <HomeStats stats={stats} />

            <HomeHeaderSearch />
        </HomeHeaderStyle>
    );
};

export default HomeHeader;
