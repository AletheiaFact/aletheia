import {Row, Typography} from "antd";
import colors from "../../styles/colors";
import {useTranslation} from "next-i18next";

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
            <p style={{width: "100%"}}>
                {t("codeOfConduct:introductionSectionFirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:principlesSection")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:principlesSectionFirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:dutiesSection")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:dutiesSectionFirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:methodologySection")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:methodologySectionFirstParagraph")}
            </p>
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
            <p style={{width: "100%"}}>
                {t("codeOfConduct:methodologySectionSecondParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:expectedBehaviorSection")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:expectedBehaviorSectionFirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:expectedBehaviorSubSection1")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:expectedBehaviorSubSection1FirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:expectedBehaviorSubSection2")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:expectedBehaviorSubSection2FirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:unacceptableBehaviorSection")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:unacceptableBehaviorSectionFirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:unacceptableBehaviorSubSection1")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:unacceptableBehaviorSubSection1FirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:unacceptableBehaviorSubSection2")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:unacceptableBehaviorSubSection2FirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:unacceptableBehaviorSubSection3")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:unacceptableBehaviorSubSection3FirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={2}>{t("codeOfConduct:responsibilitiesSection")}</Title>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:responsibilitiesSectionSubSection1")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:responsibilitiesSectionSubSection1FirstParagraph")}
            </p>
            <Title style={{width: "100%", marginTop: "10px"}} level={3}>{t("codeOfConduct:responsibilitiesSectionSubSection2")}</Title>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:responsibilitiesSectionSubSection2FirstParagraph")}
            </p>
            <p style={{width: "100%"}}>
                {t("codeOfConduct:responsibilitiesSectionSubSection2SecondParagraph")}
            </p>
        </Row>
    )
}

export default CodeOfConduct;
