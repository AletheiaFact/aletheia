import { SocialIcon } from "react-social-icons";
import colors from "../styles/colors";
import { Row } from "antd";
import React from "react";

const AletheiaSocialMediaFooter = () => {
    return (
        <Row
            style={{
                display: "flex",
                justifyContent: "space-evenly",
                padding: "35px 10% 20px 10%",
            }}
        >
            <SocialIcon url="https://www.facebook.com/AletheiaFactorg-107521791638412" bgColor={colors.white} target='_blank' />
            <SocialIcon url="https://www.instagram.com/aletheiafact" bgColor={colors.white} target='_blank' />
            <SocialIcon url="https://www.linkedin.com/company/aletheiafact-org" bgColor={colors.white} target='_blank' />
            <SocialIcon url="https://github.com/AletheiaFact/aletheia" bgColor={colors.white} target='_blank' />

        </Row>
    );
}

export default AletheiaSocialMediaFooter;
