export const FileManagementServiceMock = {
    upload: jest.fn().mockResolvedValue({
        FileURL: "http://fake-s3/test-bucket/test-file.png",
        fileName: "test-file.png",
        Extension: "png",
        DataHash: "fakehash123",
    }),
};
