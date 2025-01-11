import { Col, Divider, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import AletheiaSocialMediaIcons from "./AletheiaSocialMediaIcons";
import localConfig from "../../../config/localConfig";
import { SocialIcon } from "react-social-icons";
import { NameSpaceEnum } from "../../types/Namespace";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";

const AletheiaSocialMediaFooter = () => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    return (
        <Row
            justify="center"
            style={{
                padding: "10px 0",
            }}
        >
            <Col span={24}>
                <h3 style={{ fontSize: "23px", color: colors.white }}>
                    {t("footer:socialMedia")}
                </h3>
            </Col>
            <Col span={24}>
                {localConfig.footer.socialMedias.some((url) => url !== "") ? (
                    localConfig.footer.socialMedias.map(
                        (url) =>
                            url! && (
                                <SocialIcon
                                    key={url}
                                    url={url}
                                    bgColor={
                                        nameSpace === NameSpaceEnum.Main
                                            ? colors.primary
                                            : colors.secondary
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    fgColor="white"
                                />
                            )
                    )
                ) : (
                    <AletheiaSocialMediaIcons />
                )}
            </Col>
            <Col style={{ width: "324px", margin: "10px auto" }}>
                <Divider
                    style={{
                        backgroundColor: colors.white,
                    }}
                />
            </Col>
        </Row>
    );
};

export default AletheiaSocialMediaFooter;
