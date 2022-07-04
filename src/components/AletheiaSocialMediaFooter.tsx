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
            <SocialIcon url="https://www.facebook.com/AletheiaFactorg-107521791638412" bgColor={colors.bluePrimary} target='_blank' fgColor="white" />
            <SocialIcon url="https://www.instagram.com/aletheiafact" bgColor={colors.bluePrimary} target='_blank' fgColor="white" />
            <SocialIcon url="https://www.linkedin.com/company/aletheiafact-org" bgColor={colors.bluePrimary} target='_blank' fgColor="white" />
            <SocialIcon url="https://github.com/AletheiaFact/aletheia" bgColor={colors.bluePrimary} target='_blank' fgColor="white" />

        </Row>
    );
}

export default AletheiaSocialMediaFooter;
