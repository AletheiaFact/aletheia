import { Contains, Equals, IsAlphanumeric, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Personality } from "../../personality/schemas/personality.schema";
import { Claim } from "../../claim/schemas/claim.schema";

export class createClaimReview {
    @IsNotEmpty()
    @IsString()
    @Equals(
      "not-fact" || "true" || "true-but" || "arguable" || "misleading" || 
      "false" || "unsustainable" || "exaggerated" || "unverifiable"
    ) /*utilizei contains e equals e nenhum trouxe o resultado certo, aparentemente
    não há um validator*/
    classification: string;

    @IsString()
    @IsAlphanumeric()
    claim: Claim;

    @IsAlphanumeric()
    personality: Personality;

    @IsString()
    @IsAlphanumeric()
    sentence_hash: string;

    @IsString()
    sentence_content: string;

    @IsNotEmpty()
    @IsString()
    report: string;

    @IsString()
    recaptcha: string

    @IsNotEmpty()
    @IsArray()
    sources: string[]
}