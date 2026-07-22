import { useTranslations } from "next-intl";
import colors from "../styles/colors";
import AletheiaVideo from "./AletheiaVideo";

const VideoCTACard = () => {
    const tVideoCard = useTranslations("videoCard");
    return (
        <div
            style={{
                width: "clamp(120px, 76vw, 290px)",
                display: "grid",
                borderRadius: "8px",
                backgroundColor: colors.neutralSecondary,
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
                {tVideoCard("content")}
            </p>
            <div
                style={{
                    display: "flex",
                    padding: "16px 30px 27px 30px",
                    aspectRatio: "16 / 9",
                }}
            >
                <AletheiaVideo />
            </div>
        </div>
    );
};

export default VideoCTACard;
