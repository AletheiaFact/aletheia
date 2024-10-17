import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/store";
import StyledSpan from "./AletheiaInfo.style";

const AletheiaInfo = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const footerInfos = [
        "footer:contactEmail",
        "footer:adressStreet",
        "footer:adressZipcode",
        "footer:legalRegistration",
    ];
    return (
        <>
            <h3
                style={{
                    width: "100%",
                    fontSize: "23px",
                    color: colors.white,
                    marginBottom: 0,
                    marginTop: vw?.sm ? "64px" : "0",
                    textAlign: "center",
                }}
            >

                {t("footer:platformInfoTittle")}
            </h3>
            {footerInfos.map((i) => (
                <StyledSpan key={i}>{t(i)}</StyledSpan>
            ))}

        </>
    );
};

export default AletheiaInfo;
