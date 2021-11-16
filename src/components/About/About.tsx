import {Row, Typography} from "antd";
import colors from "../../styles/colors";
import { Trans, useTranslation } from "next-i18next";

const About = () => {
    const { t } = useTranslation();
    const paragraphStyle = {
        margin: "10px 0px"
    }
    return (
        <Row
            style={{
                color: colors.bluePrimary,
                justifyContent: "center",
                width: "100%",
                fontSize: "1rem",
                letterSpacing: "1px",
                fontWeight: 500,
                padding: "20px"
            }}
        >
            <Typography.Title>
                {t("about:title")}
            </Typography.Title>
            <Row style={paragraphStyle}>
                <Trans
                    i18nKey={"about:firstParagraph"}
                    components={[
                        <a style={{whiteSpace: "pre-wrap"}} href="https://wikipedia.org" target="_blank"></a>,
                        <a style={{whiteSpace: "pre-wrap"}} href="https://demagog.cz/" target="_blank"></a>
                    ]}
                />
            </Row>
            <Row style={paragraphStyle}>
                {t("about:secondParagraph")}
            </Row>
            <Row style={paragraphStyle}>
                <Trans
                    i18nKey={"about:thirdParagraph"}
                    components={[
                        <a style={{whiteSpace: "pre-wrap"}} href="https://github.com/AletheiaFact/aletheia" target="_blank"></a>,
                        <a style={{whiteSpace: "pre-wrap"}} href="https://builders.mozilla.community/programs.html#open-lab" target="_blank"></a>,
                        <a style={{whiteSpace: "pre-wrap"}} href="https://www.figma.com/proto/J6OY3ZQILdR7H1qCWyqVw7/Aletheia?node-id=670%3A3370&viewport=849%2C517%2C0.33680295944213867&scaling=scale-down" target="_blank"></a>
                    ]}
                />
            </Row>
        </Row>
    )
}

export default About
