/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/heading-has-content */
import { Collapse, Row, Typography } from "antd";
import colors from "../../styles/colors";
import { Trans, useTranslation } from "next-i18next";
import TitlePrivacyPolicy from "./PrivacyPolicyTitle";

const { Title } = Typography;

const PrivacyPolicy = () =>{
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
            <Title level={1}>{t("privacyPolicy:title")}</Title>
            <p>{t("privacyPolicy:leadParagraph")}</p>
            <ul>
                <li key={1}>{t("privacyPolicy:tableOfContentsItem1")}</li>
                <li key={2}>{t("privacyPolicy:tableOfContentsItem2")}</li>
                <li key={3}>{t("privacyPolicy:tableOfContentsItem3")}</li>
                <li key={4}>{t("privacyPolicy:tableOfContentsItem4")}</li>
                <li key={5}>{t("privacyPolicy:tableOfContentsItem5")}</li>
                <li key={6}>{t("privacyPolicy:tableOfContentsItem6")}</li>
                <li key={7}>{t("privacyPolicy:tableOfContentsItem7")}</li>
                <li key={8}>{t("privacyPolicy:tableOfContentsItem8")}</li>
                <li key={9}>{t("privacyPolicy:tableOfContentsItem9")}</li>
                <li key={0}>{t("privacyPolicy:tableOfContentsItem10")}</li>
            </ul>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleItem1")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item1")}</p>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleItem2")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item2")}</p>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleItem3")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item3")}</p>
            <TitlePrivacyPolicy level={2}>{t("privacyPolicy:subTitleItem4")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item4")}</p>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleItem5")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item5")}</p>
            <Collapse
                style={{
                    width: "100%",
                    margin: "15px 0px"
                }}
            >
                <Collapse.Panel header={t("privacyPolicy:trackingToolsPanelRecaptchaHeader")} key={1}>
                    <Trans
                        i18nKey={"privacyPolicy:trackingToolsPanelReCaptchaContent"}
                        components={[
                            <a style={{whiteSpace: "pre-wrap"}} href="https://policies.google.com/privacy?hl=en" target="_blank" rel="noreferrer"></a>,
                            <a style={{whiteSpace: "pre-wrap"}} href="https://policies.google.com/terms?hl=en" target="_blank" rel="noreferrer"></a>
                        ]}
                    />
                </Collapse.Panel>
                <Collapse.Panel header={t("privacyPolicy:trackingToolsPanelSessionCookiesHeader")} key={2}>
                    {t("privacyPolicy:trackingToolsPanelSessionCookiesContent")}
                </Collapse.Panel>
                <Collapse.Panel header={t("privacyPolicy:trackingToolsPanelUmamiHeader")} key={3}>
                    <Trans
                        i18nKey={"privacyPolicy:trackingToolsPanelUmamiContent"}
                        components={[
                            <a style={{whiteSpace: "pre-wrap"}} href="https://umami.is/" target="_blank" rel="noreferrer"></a>,
                            <h3 style={{ marginTop: "10px" }}></h3>,
                            <h3 style={{ marginTop: "10px" }}></h3>,
                        ]}
                    />
                </Collapse.Panel>
            </Collapse>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleItem6")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item6")}</p>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleItem7")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item7")}</p>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleItem8")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item8")}</p>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleItem9")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item9")}</p>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleItem10")}</TitlePrivacyPolicy>
            <p>{t("privacyPolicy:item10")}</p>
            <TitlePrivacyPolicy>{t("privacyPolicy:subTitleContact")}</TitlePrivacyPolicy>
            <Trans
                i18nKey={"privacyPolicy:contact"}
                values={{ email: t("common:contactEmail")}}
                components={[
                    <a style={{whiteSpace: "pre-wrap"}} href={`mailto:${t("common:contactEmail")}`} target="_blank" rel="noreferrer"></a>,
                ]}
            />
        </Row>
    )
}

export default PrivacyPolicy;