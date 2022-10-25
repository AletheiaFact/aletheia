import { useTranslation } from "next-i18next";
import colors from "../styles/colors";

const VideoCTACard = () => {
    const { t } = useTranslation();
    return (
        <div
            style={{
                width: "clamp(120px, 76vw, 290px)",
                display: "grid",
                borderRadius: "8px",
                backgroundColor: colors.graySecondary,
                alignContent: "center",
            }}
        >
            <p
                style={{
                    textAlign: "center",
                    width: "100%",
                    padding: "18px 21px 0px 21px",
                    fontWeight: 400,
                    fontSize: "18px",
                    lineHeight: "22px",
                }}
            >
                {t("videoCard:content")}
            </p>
            <div
                style={{
                    padding: "16px 30px 27px 30px",
                }}
            >
                <iframe
                    width="100%"
                    height="129px"
                    frameBorder="0"
                    allowFullScreen
                    title="video"
                    src={`https://www.youtube.com/embed/cWDqrdv-O6k`}
                />
            </div>
        </div>
    );
};

export default VideoCTACard;
