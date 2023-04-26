import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/store";

const AletheiaInfo = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);

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
            <span
                style={{
                    fontSize: "14px",
                    marginTop: "0px",
                    textAlign: "center",
                }}
            >
                {t("footer:contactEmail")}
            </span>
            <span
                style={{
                    fontSize: "14px",
                    marginTop: "0px",
                    textAlign: "center",
                }}
            >
                Av Maria Ranieri, Nº 7-50
            </span>
            <span
                style={{
                    fontSize: "14px",
                    marginTop: "0px",
                    textAlign: "center",
                }}
            >
                17.055-175 - Parque Viaduto - Bauru/SP
            </span>
            <span
                style={{
                    fontSize: "14px",
                    marginTop: "0px",
                    textAlign: "center",
                }}
            >
                46.428.905/0001-68
            </span>
        </>
    );
};

export default AletheiaInfo;
