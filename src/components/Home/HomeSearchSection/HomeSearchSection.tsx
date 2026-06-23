import React from "react";
import HomeSearch from "./HomeSearch";
import HomeFeed from "./HomeFeed";
import HomeSearchSectionStyled from "./HomeSearchSection.style";

const HomeSearchSection = () => {
    return (
        <HomeSearchSectionStyled>
            <HomeSearch />
            <HomeFeed />
        </HomeSearchSectionStyled>
    );
};

export default HomeSearchSection;
