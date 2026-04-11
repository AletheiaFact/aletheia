import { ConfigService } from "@nestjs/config";

interface RequiredAwsConfig {
    configPath: string;
    envVar: string;
}

const REQUIRED_AWS_CONFIG: RequiredAwsConfig[] = [
    { configPath: "aws.bucket", envVar: "AWS_SDK_BUCKET" },
    { configPath: "aws.region", envVar: "AWS_REGION" },
    { configPath: "aws.accessKeyId", envVar: "AWS_ACCESS_KEY_ID" },
    { configPath: "aws.secretAccessKey", envVar: "AWS_SECRET_ACCESS_KEY" },
];

/**
 * Validates required AWS configuration at startup time.
 *
 * Throws immediately if any required setting is missing or empty, so that
 * misconfigured deployments fail at startup rather than at first upload
 * attempt. This is the safety net that prevents the failure mode that
 * caused PR #2331 to be rolled back.
 */
export class AwsConfigValidator {
    static validate(configService: ConfigService): void {
        for (const { configPath, envVar } of REQUIRED_AWS_CONFIG) {
            const value = configService.get<string>(configPath);
            if (value === undefined || value === null || value === "") {
                throw new Error(
                    `Missing required AWS configuration: ${envVar} ` +
                        `(config path: ${configPath}). ` +
                        `Set this environment variable in your .env file ` +
                        `or production secrets.`
                );
            }
        }
    }
}
