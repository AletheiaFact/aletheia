import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { REQUEST } from "@nestjs/core";
import { UsersService } from "./users.service";
import { User } from "./schemas/user.schema";
import OryService from "../auth/ory/ory.service";
import { NotificationService } from "../notifications/notifications.service";
import { mockOryService } from "../mocks/AuthMock";
import { Roles, Status } from "../auth/ability/ability.factory";

describe("UsersService (Unit)", () => {
    let service: UsersService;
    let oryService: ReturnType<typeof mockOryService>;

    const mockRequest = {
        user: { _id: "admin-user-id", role: { main: Roles.Admin } },
        params: { namespace: "main" },
    };

    const mockUserModel: any = {
        find: jest.fn(),
        findById: jest.fn(),
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        aggregate: jest.fn(),
    };

    const UserModelConstructor = Object.assign(
        jest.fn().mockImplementation((data) => ({
            ...data,
            _id: data._id || "new-user-id",
            save: jest.fn().mockResolvedValue({
                ...data,
                _id: data._id || "new-user-id",
            }),
        })),
        mockUserModel
    );

    const mockNotificationService = {
        createSubscriber: jest.fn(),
    };

    beforeAll(async () => {
        oryService = mockOryService();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: REQUEST, useValue: mockRequest },
                {
                    provide: getModelToken(User.name),
                    useValue: UserModelConstructor,
                },
                { provide: OryService, useValue: oryService },
                {
                    provide: NotificationService,
                    useValue: mockNotificationService,
                },
            ],
        }).compile();

        service = await module.resolve<UsersService>(UsersService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getById", () => {
        it("should find user by id and populate badges", async () => {
            const mockUser = {
                _id: "user-123",
                name: "Test User",
                badges: [],
            };
            mockUserModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockUser),
            });

            const result = await service.getById("user-123");

            expect(mockUserModel.findById).toHaveBeenCalledWith("user-123");
            expect(result).toEqual(mockUser);
        });
    });

    describe("getByEmail", () => {
        it("should find user by email", async () => {
            const mockUser = { _id: "user-123", email: "test@example.com" };
            mockUserModel.findOne.mockResolvedValue(mockUser);

            const result = await service.getByEmail("test@example.com");

            expect(mockUserModel.findOne).toHaveBeenCalledWith({
                email: "test@example.com",
            });
            expect(result).toEqual(mockUser);
        });
    });

    describe("getByOryId", () => {
        it("should find user by Ory identity id", async () => {
            const mockUser = { _id: "user-123", oryId: "ory-id-123" };
            mockUserModel.findOne.mockResolvedValue(mockUser);

            const result = await service.getByOryId("ory-id-123");

            expect(mockUserModel.findOne).toHaveBeenCalledWith(
                { oryId: "ory-id-123" },
                "email name oryId role"
            );
        });
    });

    describe("register", () => {
        it("should create user with new Ory identity when no oryId provided", async () => {
            const userData = {
                name: "New User",
                email: "new@example.com",
                password: "password123",
                role: { main: Roles.Regular },
            };

            const result = await service.register(userData);

            expect(mockNotificationService.createSubscriber).toHaveBeenCalled();
            expect(oryService.createIdentity).toHaveBeenCalledWith(
                expect.anything(),
                "password123",
                { role: userData.role }
            );
        });

        it("should update existing Ory identity when oryId is provided", async () => {
            const userData = {
                name: "Existing User",
                email: "existing@example.com",
                password: "password123",
                role: { main: Roles.FactChecker },
                oryId: "existing-ory-id",
            };

            mockUserModel.findOne.mockResolvedValue({
                _id: "existing-user-id",
                oryId: "existing-ory-id",
            });

            await service.register(userData);

            expect(oryService.updateIdentity).toHaveBeenCalled();
            expect(oryService.createIdentity).not.toHaveBeenCalled();
        });
    });

    describe("updateUser", () => {
        it("should update user role and sync with Ory", async () => {
            const mockUser = {
                _id: "user-123",
                role: { main: Roles.Regular },
            };
            mockUserModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockUser),
            });
            mockUserModel.findByIdAndUpdate.mockResolvedValue({
                ...mockUser,
                role: { main: Roles.FactChecker },
            });

            const updates = { role: { main: Roles.FactChecker } };
            await service.updateUser("user-123", updates);

            expect(oryService.updateUserRole).toHaveBeenCalledWith(
                mockUser,
                updates.role
            );
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                "user-123",
                updates,
                { new: true }
            );
        });

        it("should update user state via Ory", async () => {
            const mockUser = { _id: "user-123", role: { main: Roles.Regular } };
            mockUserModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockUser),
            });
            mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUser);

            await service.updateUser("user-123", { state: Status.Inactive });

            expect(oryService.updateUserState).toHaveBeenCalledWith(
                mockUser,
                Status.Inactive
            );
        });
    });

    describe("registerPasswordChange", () => {
        it("should mark first password as changed", async () => {
            const mockUser = {
                _id: "user-123",
                firstPasswordChanged: false,
                save: jest.fn(),
            };
            mockUserModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockUser),
            });

            await service.registerPasswordChange("user-123");

            expect(mockUser.firstPasswordChanged).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
        });

        it("should not save if password was already changed", async () => {
            const mockUser = {
                _id: "user-123",
                firstPasswordChanged: true,
                save: jest.fn(),
            };
            mockUserModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockUser),
            });

            await service.registerPasswordChange("user-123");

            expect(mockUser.save).not.toHaveBeenCalled();
        });
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            const mockUsers = [
                { _id: "user-1", name: "User 1" },
                { _id: "user-2", name: "User 2" },
            ];
            mockUserModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUsers),
            });

            const result = await service.getAllUsers();

            expect(result).toEqual(mockUsers);
            expect(result).toHaveLength(2);
        });
    });

    describe("findAll", () => {
        it("should build aggregation pipeline with search and role filtering", async () => {
            const mockPipeline = {
                match: jest.fn().mockReturnThis(),
                lookup: jest.fn().mockReturnThis(),
                project: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            };
            mockUserModel.aggregate.mockReturnValue(mockPipeline);

            await service.findAll({
                searchName: "test",
                filterOutRoles: [Roles.SuperAdmin],
            });

            expect(mockUserModel.aggregate).toHaveBeenCalled();
            expect(mockPipeline.match).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: { $regex: "test", $options: "i" },
                })
            );
        });
    });
});
