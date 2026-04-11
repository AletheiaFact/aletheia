import { ConfigService } from "@nestjs/config";
import { AwsConfigValidator } from "./aws-config.validator";

describe("AwsConfigValidator", () => {
    const createConfigService = (
        overrides: Record<string, string | undefined> = {}
    ): ConfigService => {
        const config: Record<string, string | undefined> = {
            "aws.bucket": "aletheia",
            "aws.region": "us-east-1",
            "aws.accessKeyId": "test-key",
            "aws.secretAccessKey": "test-secret",
            ...overrides,
        };
        return {
            get: vi
                .fn<(key: string) => string | undefined>()
                .mockImplementation((key: string) => config[key]),
        } as unknown as ConfigService;
    };

    it("should pass when all required AWS config is present", () => {
        const configService = createConfigService();

        expect(() => AwsConfigValidator.validate(configService)).not.toThrow();
    });

    it("should throw with AWS_SDK_BUCKET in error message when bucket is missing", () => {
        const configService = createConfigService({ "aws.bucket": undefined });

        expect(() => AwsConfigValidator.validate(configService)).toThrow(
            /AWS_SDK_BUCKET/
        );
    });

    it("should throw with AWS_REGION in error message when region is missing", () => {
        const configService = createConfigService({ "aws.region": undefined });

        expect(() => AwsConfigValidator.validate(configService)).toThrow(
            /AWS_REGION/
        );
    });

    it("should throw with AWS_ACCESS_KEY_ID in error message when accessKeyId is missing", () => {
        const configService = createConfigService({
            "aws.accessKeyId": undefined,
        });

        expect(() => AwsConfigValidator.validate(configService)).toThrow(
            /AWS_ACCESS_KEY_ID/
        );
    });

    it("should throw with AWS_SECRET_ACCESS_KEY in error message when secretAccessKey is missing", () => {
        const configService = createConfigService({
            "aws.secretAccessKey": undefined,
        });

        expect(() => AwsConfigValidator.validate(configService)).toThrow(
            /AWS_SECRET_ACCESS_KEY/
        );
    });

    it("should treat empty string as missing", () => {
        const configService = createConfigService({ "aws.region": "" });

        expect(() => AwsConfigValidator.validate(configService)).toThrow(
            /AWS_REGION/
        );
    });

    it("should include the config path in the error message", () => {
        const configService = createConfigService({ "aws.region": undefined });

        expect(() => AwsConfigValidator.validate(configService)).toThrow(
            /config path: aws\.region/
        );
    });
});
