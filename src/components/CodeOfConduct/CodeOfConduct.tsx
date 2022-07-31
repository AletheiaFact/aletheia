import { Row, Typography } from "antd";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import Paragraph from "../Paragraph";

const { Title } = Typography;

const CodeOfConduct = () => {
    const { t } = useTranslation();
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
            <Title>{t("codeOfConduct:title")}</Title>

            <Title style={{ width: "100%", marginTop: "10px" }} level={2}>
                {t("codeOfConduct:introductionSection")}
            </Title>
            <Paragraph>
                {t("codeOfConduct:introductionSectionFirstParagraph")}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={2}>
                {t("codeOfConduct:principlesSection")}
            </Title>
            <Paragraph>
                {t("codeOfConduct:principlesSectionFirstParagraph")}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={2}>
                {t("codeOfConduct:dutiesSection")}
            </Title>
            <Paragraph>
                {t("codeOfConduct:dutiesSectionFirstParagraph")}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={2}>
                {t("codeOfConduct:methodologySection")}
            </Title>
            <Paragraph>
                {t("codeOfConduct:methodologySectionFirstParagraph")}
            </Paragraph>
            <ul style={{ width: "100%", marginTop: "15px" }}>
                <li key={1}>{t("claimReviewForm:not-fact")}</li>
                <li key={2}>{t("claimReviewForm:true")}</li>
                <li key={3}>{t("claimReviewForm:true-but")}</li>
                <li key={4}>{t("claimReviewForm:arguable")}</li>
                <li key={5}>{t("claimReviewForm:misleading")}</li>
                <li key={6}>{t("claimReviewForm:false")}</li>
                <li key={7}>{t("claimReviewForm:unsustainable")}</li>
                <li key={8}>{t("claimReviewForm:exaggerated")}</li>
                <li key={9}>{t("claimReviewForm:unverifiable")}</li>
            </ul>
            <Paragraph>
                {t("codeOfConduct:methodologySectionSecondParagraph")}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={2}>
                {t("codeOfConduct:expectedBehaviorSection")}
            </Title>
            <Paragraph>
                {t("codeOfConduct:expectedBehaviorSectionFirstParagraph")}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={3}>
                {t("codeOfConduct:expectedBehaviorSubSection1")}
            </Title>
            <Paragraph>
                {t("codeOfConduct:expectedBehaviorSubSection1FirstParagraph")}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={3}>
                {t("codeOfConduct:expectedBehaviorSubSection2")}
            </Title>
            <Paragraph>
                {t("codeOfConduct:expectedBehaviorSubSection2FirstParagraph")}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={2}>
                {t("codeOfConduct:unacceptableBehaviorSection")}
            </Title>
            <Paragraph>
                {t("codeOfConduct:unacceptableBehaviorSectionFirstParagraph")}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={3}>
                {t("codeOfConduct:unacceptableBehaviorSubSection1")}
            </Title>
            <Paragraph>
                {t(
                    "codeOfConduct:unacceptableBehaviorSubSection1FirstParagraph"
                )}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={3}>
                {t("codeOfConduct:unacceptableBehaviorSubSection2")}
            </Title>
            <Paragraph>
                {t(
                    "codeOfConduct:unacceptableBehaviorSubSection2FirstParagraph"
                )}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={3}>
                {t("codeOfConduct:unacceptableBehaviorSubSection3")}
            </Title>
            <Paragraph>
                {t(
                    "codeOfConduct:unacceptableBehaviorSubSection3FirstParagraph"
                )}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={2}>
                {t("codeOfConduct:responsibilitiesSection")}
            </Title>
            <Title style={{ width: "100%", marginTop: "10px" }} level={3}>
                {t("codeOfConduct:responsibilitiesSectionSubSection1")}
            </Title>
            <Paragraph>
                {t(
                    "codeOfConduct:responsibilitiesSectionSubSection1FirstParagraph"
                )}
            </Paragraph>
            <Title style={{ width: "100%", marginTop: "10px" }} level={3}>
                {t("codeOfConduct:responsibilitiesSectionSubSection2")}
            </Title>
            <Paragraph>
                {t(
                    "codeOfConduct:responsibilitiesSectionSubSection2FirstParagraph"
                )}
            </Paragraph>
            <Paragraph>
                {t(
                    "codeOfConduct:responsibilitiesSectionSubSection2SecondParagraph"
                )}
            </Paragraph>
        </Row>
    );
};

export default CodeOfConduct;
