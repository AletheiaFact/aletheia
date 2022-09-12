/* eslint-disable jsx-a11y/anchor-has-content */
import { Row, Typography, Button } from "antd";
import colors from "../../styles/colors";
import { Trans, useTranslation } from "next-i18next";
import AletheiaAlert from "../AletheiaAlert";
import { FilePdfOutlined } from "@ant-design/icons";

const About = () => {
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
            <AletheiaAlert
                type="info"
                message={
                    <>
                        {t("about:alertInfo")}{" "}
                        <a
                            style={{ whiteSpace: "pre-wrap" }}
                            href="https://github.com/AletheiaFact/aletheia"
                            target="_blank"
                            rel="noreferrer"
                        >
                            https://github.com/AletheiaFact/aletheia
                        </a>
                    </>
                }
                action={
                    <Button
                        type="primary"
                        size="small"
                        shape="round"
                        icon={<FilePdfOutlined />}
                        href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/AletheiaFact/miscellaneous/290b19847f0da521963f74e7947d7863bf5d5624/documents/org_legal_register.pdf"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            position: "absolute",
                            bottom: "15px",
                            right: "15px",
                        }}
                    >
                        {t("about:labelButton")}
                    </Button>
                }
            />
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
