import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { FileManagementService } from "./file-management.service";

// Mock @aws-sdk/client-s3. Variables referenced inside a vi.mock() factory
// must be declared via vi.hoisted() because vi.mock() is hoisted above all
// imports during the Vitest transform pipeline. Constructor mocks must use
// `function` (not arrow functions) so `new S3Client(...)` works.
const { mockSend } = vi.hoisted(() => ({
    mockSend: vi.fn(),
}));

vi.mock("@aws-sdk/client-s3", () => ({
    S3Client: vi.fn().mockImplementation(function () {
        return { send: mockSend };
    }),
    PutObjectCommand: vi.fn().mockImplementation(function (input) {
        this.input = input;
    }),
}));

describe("FileManagementService", () => {
    const createConfigService = (
        overrides: Record<string, string | undefined> = {}
    ): ConfigService => {
        const config: Record<string, string | undefined> = {
            "aws.bucket": "aletheia",
            "aws.region": "us-east-1",
            "aws.accessKeyId": "test-key",
            "aws.secretAccessKey": "test-secret",
            "aws.endpoint": "http://localhost:4566",
            ...overrides,
        };
        return {
            get: vi
                .fn<(key: string) => string | undefined>()
                .mockImplementation((key: string) => config[key]),
        } as unknown as ConfigService;
    };

    const buildService = async (
        configOverrides: Record<string, string | undefined> = {}
    ): Promise<FileManagementService> => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FileManagementService,
                {
                    provide: ConfigService,
                    useValue: createConfigService(configOverrides),
                },
            ],
        }).compile();
        return module.get<FileManagementService>(FileManagementService);
    };

    const createMockFile = (overrides: any = {}) => ({
        originalname: "test-image.png",
        buffer: Buffer.from("fake image data"),
        mimetype: "image/png",
        encoding: "7bit",
        size: 15,
        ...overrides,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockSend.mockResolvedValue({});
    });

    describe("upload", () => {
        it("should upload a file and return correct result shape", async () => {
            const service = await buildService();
            const file = createMockFile();

            const result = await service.upload(file);

            expect(mockSend).toHaveBeenCalledTimes(1);
            expect(result).toEqual(
                expect.objectContaining({
                    FileURL: expect.any(String),
                    Key: expect.stringContaining("test-image"),
                    Extension: "png",
                    DataHash: expect.any(String),
                })
            );
        });

        it("should target the override bucket when one is provided", async () => {
            const service = await buildService();
            const file = createMockFile();

            await service.upload(file, "override-bucket");

            const command = mockSend.mock.calls[0][0];
            expect(command.input.Bucket).toBe("override-bucket");
        });

        it("should target the default bucket when no override is provided", async () => {
            const service = await buildService();
            const file = createMockFile();

            await service.upload(file);

            const command = mockSend.mock.calls[0][0];
            expect(command.input.Bucket).toBe("aletheia");
        });

        it("should propagate errors from S3Client.send", async () => {
            const service = await buildService();
            const file = createMockFile();
            mockSend.mockRejectedValueOnce(new Error("S3 unavailable"));

            await expect(service.upload(file)).rejects.toThrow("S3 unavailable");
        });

        it("should construct path-style FileURL when endpoint is set (LocalStack)", async () => {
            const service = await buildService({
                "aws.endpoint": "http://localhost:4566",
            });
            const file = createMockFile();

            const result = await service.upload(file);

            expect(result.FileURL).toMatch(
                /^http:\/\/localhost:4566\/aletheia\/test-image-/
            );
        });

        it("should construct virtual-host FileURL when endpoint is not set (real S3)", async () => {
            const service = await buildService({
                "aws.endpoint": undefined,
            });
            const file = createMockFile();

            const result = await service.upload(file);

            expect(result.FileURL).toMatch(
                /^https:\/\/aletheia\.s3\.us-east-1\.amazonaws\.com\/test-image-/
            );
        });

        it("should pass file metadata to PutObjectCommand", async () => {
            const service = await buildService();
            const file = createMockFile();

            await service.upload(file);

            const command = mockSend.mock.calls[0][0];
            expect(command.input).toEqual(
                expect.objectContaining({
                    ContentType: "image/png",
                    ContentEncoding: "7bit",
                    ContentLength: 15,
                    Body: file.buffer,
                    ACL: "public-read",
                })
            );
        });
    });

    describe("constructor", () => {
        it("should throw if AWS config validation fails", async () => {
            await expect(
                buildService({ "aws.region": undefined })
            ).rejects.toThrow(/AWS_REGION/);
        });
    });
});
