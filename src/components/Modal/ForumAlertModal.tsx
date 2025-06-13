import AletheiaButton, { ButtonType } from "../Button";
import { AletheiaModal } from "./AletheiaModal.style";
import colors from "../../styles/colors";
import { useTranslation } from "react-i18next";

interface ForumAlertModalProps {
    open: boolean;
    onCancel?: () => void;
}

function ForumAlertModal({ open, onCancel }: ForumAlertModalProps) {
    const { t } = useTranslation();

    return (
        <AletheiaModal
            open={open}
            onCancel={onCancel}
            title={
                <h2
                    style={{
                        fontFamily: "open sans, sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        textAlign: "center",
                        textTransform: "uppercase",
                        padding: "0 34px"
                    }}>
                    {t("home:redirectTitle")}
                </h2>
            }
        >
            <p
                style={{
                    fontWeight: 600,
                    width: "100%",
                    textAlign: "center",
                    color: colors.blackSecondary,
                }}
            >
                {t("home:descriptionAlert")}
            </p>

            <div
                style={{
                    marginTop: 24,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <AletheiaButton
                    type={ButtonType.blue}
                    onClick={onCancel}
                    href={"https://forum.aletheiafact.org/"}
                    target="_blank"
                    data-cy={"testAlertModalButton"}
                >
                    {t("tutorial:okButton")}
                </AletheiaButton>
            </div>
        </AletheiaModal>
    );
}

export default ForumAlertModal;