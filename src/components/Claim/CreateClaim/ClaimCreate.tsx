import AletheiaTextArea from "../../AletheiaTextArea";
import BaseClaimForm from "./BaseClaimForm";
import { FormControl, FormHelperText } from "@mui/material";
import { useBaseClaimForm } from "./UseBaseClaimForm";
import { ContentModelEnum } from "../../../types/enums";

interface ClaimCreateProps {
    variant?: ContentModelEnum.Speech | ContentModelEnum.Unattributed;
}

const ClaimCreate = ({ variant = ContentModelEnum.Speech }: ClaimCreateProps) => {
    const {
        t, handleSubmit, content, setContent, title, setTitle, date, setDate, sources, setSources, recaptcha, setRecaptcha, isLoading, errors, clearError, isDirty
    } = useBaseClaimForm();

    return (
        <BaseClaimForm
            variant={variant}
            handleSubmit={handleSubmit}
            isDirty={isDirty}
            isLoading={isLoading}
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
                <FormControl style={{ width: "100%" }}>
                    <div className="root-label">
                        <span className="require-label">*</span>
                        <p className="form-label">
                            {t(`claimForm:createForm.${variant}.contentLabel`)}
                        </p>
                    </div>
                    <AletheiaTextArea
                        multiline
                        value={content || ""}
                        onChange={(e) => {
                            setContent(e.target.value);
                            clearError("content");
                        }}
                        placeholder={t("claimForm:createForm.contentPlaceholder")}
                        data-cy={"testContentClaim"}
                    />
                    {errors.content && (
                        <FormHelperText className="require-label">
                            {errors.content}
                        </FormHelperText>
                    )}
                    <p className="extra-label">{t("claimForm:createForm.contentHelp")}</p>
                </FormControl>
            }
        />
    );
};

export default ClaimCreate;
