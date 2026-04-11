import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AwsConfigValidator } from "./aws-config.validator";
const md5 = require("md5");

interface S3Config {
    region: string;
    endpoint?: string;
    forcePathStyle: boolean;
    /**
     * Optional credentials to use when connecting to S3.
     * Useful for connecting to a local S3 emulator (LocalStack).
     * If not provided, the default credentials provider will be used.
     */
    credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
}

@Injectable()
export class FileManagementService {
    private readonly bucket: string;
    private readonly endpoint: string | undefined;
    private readonly region: string;
    private s3Client: S3Client;

    constructor(private configService: ConfigService) {
        // Validate required AWS configuration before constructing the client.
        // Throws if any required env var is missing — this is the safety net
        // that prevents the failure mode that caused PR #2331 to be rolled back.
        AwsConfigValidator.validate(configService);

        this.bucket = this.configService.get<string>("aws.bucket");
        this.endpoint = this.configService.get<string>("aws.endpoint");
        this.region = this.configService.get<string>("aws.region");

        const s3Config: S3Config = {
            region: this.region,
            endpoint: this.endpoint,
            forcePathStyle: true,
            credentials: {
                accessKeyId: this.configService.get<string>("aws.accessKeyId"),
                secretAccessKey: this.configService.get<string>(
                    "aws.secretAccessKey"
                ),
            },
        };

        this.s3Client = new S3Client(s3Config);
    }

    /**
     * Upload file to S3 (or LocalStack)
     * @param file file to upload
     * @param bucket optional bucket override
     */
    async upload(file, bucket?: string) {
        if (!bucket && !this.bucket) {
            throw Error("S3 bucket is not defined");
        }
        const targetBucket = bucket || this.bucket;
        const name = file.originalname;
        const fileExtension = name.substring(
            name.lastIndexOf(".") + 1,
            name.length
        );
        const fileName = `${name.substring(
            0,
            name.indexOf(".")
        )}-${new Date().toISOString()}.${fileExtension}`;

        const imageDataHash = md5(file.buffer);

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: targetBucket,
                Key: fileName,
                ContentType: file?.mimetype,
                ContentEncoding: file?.encoding,
                ContentLength: file?.size,
                Body: file.buffer,
                ACL: "public-read", // TODO: remove on future to create security
            })
        );

        // Construct the public URL based on whether an endpoint is configured.
        // - LocalStack (endpoint set): use path-style URL
        //   e.g. http://localhost:4566/aletheia/filename.png
        // - Real S3 (no endpoint): use virtual-host-style URL
        //   e.g. https://aletheia.s3.us-east-1.amazonaws.com/filename.png
        // This matches what the AWS SDK v2 upload() helper returned.
        const FileURL = this.endpoint
            ? `${this.endpoint}/${targetBucket}/${fileName}`
            : `https://${targetBucket}.s3.${this.region}.amazonaws.com/${fileName}`;

        return {
            FileURL,
            Key: fileName,
            Extension: fileName.substring(
                fileName.lastIndexOf(".") + 1,
                fileName.length
            ),
            DataHash: imageDataHash,
        };
    }
}
