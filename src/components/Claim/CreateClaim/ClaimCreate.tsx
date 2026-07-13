import AletheiaTextArea from "../../AletheiaTextArea";
import BaseClaimForm from "./BaseClaimForm";
import { FormControl, FormHelperText } from "@mui/material";
import { useBaseClaimForm } from "./UseBaseClaimForm";
import { useTranslations } from "next-intl";

const ClaimCreate = () => {
    const {
        handleSubmit, content, setContent, title, setTitle, date, setDate, sources, setSources, recaptcha, setRecaptcha, isLoading, errors, clearError
    } = useBaseClaimForm();
    const tClaimForm = useTranslations("claimForm");


    return (
        <BaseClaimForm
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            disclaimer={tClaimForm("disclaimer")}
            dateExtraText={tClaimForm("dateFieldHelp")}
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
                        <p className="form-label">{tClaimForm("contentField")}</p>
                    </div>
                    <AletheiaTextArea
                        multiline
                        value={content || ""}
                        onChange={(e) => {
                            setContent(e.target.value);
                            clearError("content");
                        }}
                        placeholder={tClaimForm("contentFieldPlaceholder")}
                        data-cy={"testContentClaim"}
                    />
                    {errors.content && (
                        <FormHelperText className="require-label">
                            {errors.content}
                        </FormHelperText>
                    )}
                    <p className="extra-label">{tClaimForm("contentFieldHelp")}</p>
                </FormControl>
            }
        />
    );
};

export default ClaimCreate;
