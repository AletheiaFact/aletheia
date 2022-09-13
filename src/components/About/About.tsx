/* eslint-disable jsx-a11y/anchor-has-content */
import { Row, Typography } from "antd";
import colors from "../../styles/colors";
import { Trans, useTranslation } from "next-i18next";
import InfoAlert from "../InfoAlert";

const About = ({ enableWarningDocument }) => {
    const { t } = useTranslation();
    const paragraphStyle = {
        margin: "10px 0px",
        width: "100%",
    };
    return (
        <Row
            style={{
                color: colors.bluePrimary,
                justifyContent: "center",
                width: "100%",
                fontSize: "1rem",
                letterSpacing: "1px",
                fontWeight: 600,
                padding: "20px",
            }}
        >
            {enableWarningDocument && <InfoAlert />}
            <Row style={{ width: "100%", textAlign: "center" }}>
                <Typography.Title style={{ width: "100%" }}>
                    {t("about:title")}
                </Typography.Title>
            </Row>
            <Row style={paragraphStyle}>{t("about:intro")}</Row>
            <Row style={{ width: "100%", textAlign: "center" }}>
                <Typography.Title style={{ width: "100%" }} level={3}>
                    {t("about:visionTitle")}
                </Typography.Title>
            </Row>
            <Row style={paragraphStyle}>{t("about:visionContent")}</Row>
            <Row style={{ width: "100%", textAlign: "center" }}>
                <Typography.Title style={{ width: "100%" }} level={3}>
                    {t("about:missionTitle")}
                </Typography.Title>
            </Row>
            <Row style={paragraphStyle}>{t("about:missionContent")}</Row>
            <Row style={{ width: "100%", textAlign: "center" }}>
                <Typography.Title style={{ width: "100%" }} level={3}>
                    {t("about:valuesTitle")}
                </Typography.Title>
            </Row>
            <Row style={paragraphStyle}>
                <ul>
                    <li key={1}>{t("about:valueAccessibility")}</li>
                    <li key={2}>{t("about:valueCredibility")}</li>
                    <li key={3}>{t("about:valueAutonomy")}</li>
                </ul>
            </Row>
            <Row style={paragraphStyle}>
                <Trans
                    i18nKey={"about:firstParagraph"}
                    components={[
                        <a
                            style={{ whiteSpace: "pre-wrap" }}
                            href="https://wikipedia.org"
                            target="_blank"
                            rel="noreferrer"
                        ></a>,
                        <a
                            style={{ whiteSpace: "pre-wrap" }}
                            href="https://demagog.cz/"
                            target="_blank"
                            rel="noreferrer"
                        ></a>,
                    ]}
                />
            </Row>
            <Row style={paragraphStyle}>{t("about:secondParagraph")}</Row>
            <Row style={paragraphStyle}>
                <Trans
                    i18nKey={"about:thirdParagraph"}
                    components={[
                        <a
                            style={{ whiteSpace: "pre-wrap" }}
                            href="https://github.com/AletheiaFact/aletheia"
                            target="_blank"
                            rel="noreferrer"
                        ></a>,
                        <a
                            style={{ whiteSpace: "pre-wrap" }}
                            href="https://builders.mozilla.community/programs.html#open-lab"
                            target="_blank"
                            rel="noreferrer"
                        ></a>,
                        <a
                            style={{ whiteSpace: "pre-wrap" }}
                            href="https://www.figma.com/proto/J6OY3ZQILdR7H1qCWyqVw7/Aletheia?node-id=670%3A3370&viewport=849%2C517%2C0.33680295944213867&scaling=scale-down"
                            target="_blank"
                            rel="noreferrer"
                        ></a>,
                    ]}
                />
            </Row>
        </Row>
    );
};

export default About;
