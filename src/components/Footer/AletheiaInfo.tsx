import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/store";
import localConfig from "../../../config/localConfig";
import AletheiaInfoAdress from "./AletheiaInfoAdress";

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

                {localConfig.footer.platformInfoTitle ? localConfig.footer.platformInfoTitle : t("footer:platformInfoTittle")}
            </h3>
            <span
                style={{
                    fontSize: "14px",
                    marginTop: "0px",
                    textAlign: "center",
                }}
            >
                {localConfig.footer.contactEmail ? localConfig.footer.contactEmail : t("footer:contactEmail")}
            </span>
            {localConfig.footer.address ? localConfig.footer.address : <AletheiaInfoAdress />}

        </>
    );
};

export default AletheiaInfo;
