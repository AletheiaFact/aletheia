import { Col, Divider, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { SocialIcon } from "react-social-icons";

import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import localConfig from "../../../config/localConfig";
import { Item } from "yjs";

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
                {localConfig.footer.socialMedias.map((url, index) => (
                    <SocialIcon
                        key={index}
                        url={url}
                        bgColor={
                            nameSpace === NameSpaceEnum.Main
                                ? colors.bluePrimary
                                : colors.blueSecondary
                        }
                        target="_blank"
                        rel="noreferrer"
                        fgColor="white"
                    />
                ))}
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
