import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
const md5 = require("md5");

@Injectable()
export class FileManagementService {
    private readonly bucket;
    private s3;

    constructor(private configService: ConfigService) {
        this.bucket = this.configService.get<string>("aws.bucket");
        const s3Config = {
            accessKeyId: this.configService.get<string>("aws.accessKeyId"),
            secretAccessKey: this.configService.get<string>(
                "aws.secretAccessKey"
            ),
            endpoint: this.configService.get<string>("aws.endpoint"),
            s3ForcePathStyle: true,
        };

        this.s3 = new S3(s3Config);
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

        const { Location, Key } = await this.s3
            .upload({
                Bucket: bucket || this.bucket,
                Key: fileName,
                ContentType: file?.mimetype,
                ContentEncoding: file?.encoding,
                ContentLength: file?.size,
                Body: file.buffer,
                ACL: "public-read", // TODO: remove on future to create security
            })
            .promise();

        const result = {
            FileURL: Location,
            Key,
            Extension: Key.substring(Key.lastIndexOf(".") + 1, Key.length),
            DataHash: imageDataHash,
        };
        return result;
    }
}
