import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const md5 = require("md5");

interface S3Config {
    endpoint: string;
    forcePathStyle: boolean;
    region: string;
    /**
     * Optional credentials to use when connecting to S3.
     * Useful for connecting to a local S3 emulator.
     * If not provided, the default credentials provider will be used.
     */
    credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
}

@Injectable()
export class FileManagementService {
    private readonly bucket;
    private s3Client: S3Client;

    constructor(private configService: ConfigService) {
        this.bucket = this.configService.getOrThrow<string>("aws.bucket");
        const s3Config: S3Config = {
            endpoint: this.configService.getOrThrow<string>("aws.endpoint"),
            forcePathStyle: true,
            region: this.configService.getOrThrow<string>("aws.region"),
            credentials: {
                accessKeyId:
                    this.configService.getOrThrow<string>("aws.accessKeyId"),
                secretAccessKey: this.configService.getOrThrow<string>(
                    "aws.secretAccessKey"
                ),
            },
        };

        this.s3Client = new S3Client(s3Config);
    }

    /**
     * Upload file on AWS
     * @param file file to upload on AWS-S3
     * @param bucket bucket where the file will send
     */
    async upload(file, bucket?: string) {
        if (!bucket && !this.bucket) {
            throw Error("S3 bucket is not defined");
        }
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
                Bucket: bucket || this.bucket,
                Key: fileName,
                ContentType: file?.mimetype,
                ContentEncoding: file?.encoding,
                ContentLength: file?.size,
                Body: file.buffer,
                ACL: "public-read", // TODO: remove on future to create security
            })
        );

        const Location = `${this.configService.getOrThrow<string>(
            "aws.endpoint"
        )}/${bucket || this.bucket}/${fileName}`;

        const result = {
            FileURL: Location,
            fileName,
            Extension: fileName.substring(
                fileName.lastIndexOf(".") + 1,
                fileName.length
            ),
            DataHash: imageDataHash,
        };
        return result;
    }
}
