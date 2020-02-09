const PersonalityController = require("../../../api/controller/personalityController");
const PersonalityRepository = require("../../../api/repository/personality");

describe("Personality Controller", () => {
    let personality = null;
    beforeEach(() => {
        personality = new PersonalityController();
    });

    test("Get All", () => {
        const mockListAll = jest.spyOn(PersonalityRepository, "listAll");
        mockListAll.mockImplementation(() => {
            return {};
        });

        personality.listAll().then(expect(personality).toMatchObject({}));

        mockListAll.mockRestore();
    });

    test("Get By Id", () => {
        const mockGetById = jest.spyOn(PersonalityRepository, "getById");
        mockGetById.mockImplementation(() => {
            return {};
        });

        personality
            .getPersonalityId("objectId")
            .then(expect(personality).toMatchObject({}));

        mockGetById.mockRestore();
    });

    test("Create", () => {
        const mockCreate = jest.spyOn(PersonalityRepository, "create");
        mockCreate.mockImplementation(() => {
            return {};
        });

        personality.create({}).then(expect(personality).toMatchObject({}));

        mockCreate.mockRestore();
    });

    test("Update", () => {
        const mockUpdate = jest.spyOn(PersonalityRepository, "update");
        mockUpdate.mockImplementation(() => {
            return {};
        });

        personality
            .update("objectId", {})
            .then(expect(personality).toMatchObject({}));

        mockUpdate.mockRestore();
    });

    test("Delete", () => {
        const mockUpdate = jest.spyOn(PersonalityRepository, "delete");
        mockUpdate.mockImplementation(() => {
            return {};
        });

        personality
            .update("objectId")
            .then(expect(personality).toMatchObject({}));

        mockUpdate.mockRestore();
    });

    afterEach(() => {
        personality = null;
    });
});
