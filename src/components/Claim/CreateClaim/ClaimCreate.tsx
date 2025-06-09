import TextArea from "../../TextArea";
import BaseClaimForm from "./BaseClaimForm";
import { FormControl, FormHelperText } from "@mui/material";
import { useBaseClaimForm } from "./UseBaseClaimForm";

const ClaimCreate = () => {
    const {
        t, handleSubmit, content, setContent, title, setTitle, date, setDate, sources, setSources, recaptcha, setRecaptcha, isLoading, errors, clearError
    } = useBaseClaimForm();

    return (
        <BaseClaimForm
            handleSubmit={handleSubmit}
            disableFutureDates
            isLoading={isLoading}
            disclaimer={t("claimForm:disclaimer")}
            dateExtraText={t("claimForm:dateFieldHelp")}
            errors={errors}
            clearError={clearError}
            recaptcha={recaptcha}
            setRecaptcha={setRecaptcha}
            setTitle={setTitle}
            date={date}
            setDate={setDate}
            setSources={setSources}
            title={title}
            sources={sources}
            content={
                <FormControl
                    style={{
                        width: "100%",
                        marginTop: "24px",
                    }}
                >
                    <div className="root-label">
                        <span className="require-label">*</span>
                        <p className="form-label">{t("claimForm:contentField")}</p>
                    </div>
                    <TextArea
                        multiline
                        value={content || ""}
                        onChange={(e) => {
                            setContent(e.target.value);
                            clearError("content");
                        }}
                        placeholder={t("claimForm:contentFieldPlaceholder")}
                        data-cy={"testContentClaim"}
                    />
                    {errors.content && (
                        <FormHelperText className="require-label">
                            {errors.content}
                        </FormHelperText>
                    )}
                    <p className="extra-label">{t("claimForm:contentFieldHelp")}</p>
                </FormControl>
            }
        />
    );
};

export default ClaimCreate;