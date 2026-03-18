import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const md5 = require("md5");

@Injectable()
export class FileManagementService {
    private readonly bucket;
    private s3: S3Client;

    constructor(private configService: ConfigService) {
        this.bucket = this.configService.get<string>("aws.bucket");
        const endpoint = this.configService.get<string>("aws.endpoint");
        const s3Config: Record<string, any> = {
            region: this.configService.get<string>("aws.region"),
            credentials: {
                accessKeyId: this.configService.get<string>("aws.accessKeyId"),
                secretAccessKey: this.configService.get<string>(
                    "aws.secretAccessKey"
                ),
            },
        };

        if (endpoint) {
            s3Config.endpoint = endpoint;
            s3Config.forcePathStyle = true;
        }

        this.s3 = new S3Client(s3Config);
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

        await this.s3.send(
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

        const Location = `${this.configService.get<string>("aws.endpoint")}/${
            bucket || this.bucket
        }/${fileName}`;

        const Key = fileName;

        const result = {
            FileURL: Location,
            Key,
            Extension: Key.substring(Key.lastIndexOf(".") + 1, Key.length),
            DataHash: imageDataHash,
        };
        return result;
    }
}
