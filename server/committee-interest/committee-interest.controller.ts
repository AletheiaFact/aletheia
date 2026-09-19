import {
    Body,
    Controller,
    Post,
    UnprocessableEntityException,
} from "@nestjs/common";
import { Public } from "../auth/decorators/auth.decorator";
import { CaptchaService } from "../captcha/captcha.service";
import { NotificationService } from "../notifications/notifications.service";
import { ZodValidationPipe } from "../ai-task/pipes/zod-validation.pipe";
import {
    CreateCommitteeInterestApplicationDto,
    CreateCommitteeInterestApplicationSchema,
} from "./dto/create-committee-interest-application.dto";

@Controller()
export class CommitteeInterestController {
    constructor(
        private readonly captchaService: CaptchaService,
        private readonly notificationService: NotificationService
    ) {}

    @Post("api/committee-interest")
    @Public()
    public async create(
        @Body(new ZodValidationPipe(CreateCommitteeInterestApplicationSchema))
        payload: CreateCommitteeInterestApplicationDto
    ) {
        const validateCaptcha = await this.captchaService.validate(
            payload.recaptcha
        );
        if (!validateCaptcha) {
            throw new UnprocessableEntityException(
                "Error validating captcha"
            );
        }

        await this.notificationService.sendCommitteeInterestApplication({
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            city: payload.city,
            state: payload.state,
            country: payload.country,
            region: payload.region,
            actingAs: payload.actingAs,
            institution: payload.institution,
            role: payload.role,
            interestAreas: payload.interestAreas,
            contributionTypes: payload.contributionTypes,
            availability: payload.availability,
            priorExperience: payload.priorExperience,
            motivation: payload.motivation,
            submittedAt: new Date().toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
            }),
        });

        return { success: true };
    }
}
