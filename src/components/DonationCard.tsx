import { useTranslation } from "next-i18next";
import colors from "../styles/colors";
import Image from "next/image";

const DonationCard = () => {
    const { t } = useTranslation();
    return (
        <div
            style={{
                width: "clamp(120px, 76vw, 290px)",
                display: "grid",
                borderRadius: "8px",
                backgroundColor: "#4F8DB4",
                alignContent: "center",
            }}
        >
            <p
                style={{
                    textAlign: "center",
                    width: "100%",
                    padding: "22px 34px 0px 34px",
                    marginBottom: "0px",
                    fontWeight: 800,
                    color: colors.white,
                    fontSize: "16px",
                    lineHeight: "24px",
                }}
            >
                {t("donationCard:tittle")}
            </p>
            <p
                style={{
                    padding: "7px 23px 0px 23px",
                    color: colors.white,
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: "10px",
                    marginBottom: "0px",
                    lineHeight: "24px",
                    textAlign: "center",
                }}
            >
                {t("donationCard:message")}
            </p>
            <div
                style={{
                    padding: "16px 30px 27px 30px",
                }}
            >
                <Image
                    src="/aletheia-pix.png"
                    alt="Aletheia donation QR code"
                    sizes="100%"
                    width={155}
                    height={155}
                />
            </div>
        </div>
    );
};

export default DonationCard;
