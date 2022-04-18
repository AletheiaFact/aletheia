import {Row, Typography} from "antd";
import colors from "../../styles/colors";
import {useTranslation} from "next-i18next";
import CodeOfConductParagraph from "./CodeOfConductParagraph";

const { Title } = Typography;

const CodeOfConduct = () =>{
    const { t } = useTranslation();
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

            <Title>{t("codeOfConduct:title")}</Title>

            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:introductionSection")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:introductionSectionFirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:principlesSection")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:principlesSectionFirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:dutiesSection")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:dutiesSectionFirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:methodologySection")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:methodologySectionFirstParagraph")}
            </CodeOfConductParagraph>
            <ul style={{ width: "100%", marginTop: "15px"}}>
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
            <CodeOfConductParagraph>
                {t("codeOfConduct:methodologySectionSecondParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:expectedBehaviorSection")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:expectedBehaviorSectionFirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:expectedBehaviorSubSection1")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:expectedBehaviorSubSection1FirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:expectedBehaviorSubSection2")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:expectedBehaviorSubSection2FirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:unacceptableBehaviorSection")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:unacceptableBehaviorSectionFirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:unacceptableBehaviorSubSection1")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:unacceptableBehaviorSubSection1FirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:unacceptableBehaviorSubSection2")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:unacceptableBehaviorSubSection2FirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:unacceptableBehaviorSubSection3")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:unacceptableBehaviorSubSection3FirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:responsibilitiesSection")}</Title>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:responsibilitiesSectionSubSection1")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:responsibilitiesSectionSubSection1FirstParagraph")}
            </CodeOfConductParagraph>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:responsibilitiesSectionSubSection2")}</Title>
            <CodeOfConductParagraph>
                {t("codeOfConduct:responsibilitiesSectionSubSection2FirstParagraph")}
            </CodeOfConductParagraph>
            <CodeOfConductParagraph>
                {t("codeOfConduct:responsibilitiesSectionSubSection2SecondParagraph")}
            </CodeOfConductParagraph>
        </Row>
    )
}

export default CodeOfConduct;
