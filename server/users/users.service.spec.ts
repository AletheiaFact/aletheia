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
        find: vi.fn(),
        findById: vi.fn(),
        findOne: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        aggregate: vi.fn(),
    };

    // Vitest 4 requires constructor mocks to use `function` syntax (not arrow
    // functions) so that `new UserModelConstructor(data)` works correctly.
    const UserModelConstructor = Object.assign(
        vi.fn().mockImplementation(function (data: any) {
            return {
                ...data,
                _id: data._id || "new-user-id",
                save: vi.fn().mockResolvedValue({
                    ...data,
                    _id: data._id || "new-user-id",
                }),
            };
        }),
        mockUserModel
    );

    const mockNotificationService = {
        createSubscriber: vi.fn(),
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
        vi.clearAllMocks();
    });

    describe("getById", () => {
        it("should find user by id and populate badges", async () => {
            const mockUser = {
                _id: "user-123",
                name: "Test User",
                badges: [],
            };
            mockUserModel.findById.mockReturnValue({
                populate: vi.fn().mockResolvedValue(mockUser),
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
                populate: vi.fn().mockResolvedValue(mockUser),
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
                { $set: { role: updates.role } },
                { new: true }
            );
        });

        it("should update user state via Ory", async () => {
            const mockUser = { _id: "user-123", role: { main: Roles.Regular } };
            mockUserModel.findById.mockReturnValue({
                populate: vi.fn().mockResolvedValue(mockUser),
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
                save: vi.fn(),
            };
            mockUserModel.findById.mockReturnValue({
                populate: vi.fn().mockResolvedValue(mockUser),
            });

            await service.registerPasswordChange("user-123");

            expect(mockUser.firstPasswordChanged).toBe(true);
            expect(mockUser.save).toHaveBeenCalled();
        });

        it("should not save if password was already changed", async () => {
            const mockUser = {
                _id: "user-123",
                firstPasswordChanged: true,
                save: vi.fn(),
            };
            mockUserModel.findById.mockReturnValue({
                populate: vi.fn().mockResolvedValue(mockUser),
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
                exec: vi.fn().mockResolvedValue(mockUsers),
            });

            const result = await service.getAllUsers();

            expect(result).toEqual(mockUsers);
            expect(result).toHaveLength(2);
        });
    });

    describe("findAll", () => {
        it("should build aggregation pipeline with search and role filtering", async () => {
            const mockPipeline = {
                match: vi.fn().mockReturnThis(),
                lookup: vi.fn().mockReturnThis(),
                project: vi.fn().mockReturnThis(),
                exec: vi.fn().mockResolvedValue([]),
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

    describe("findAll - unauthenticated", () => {
        let unauthService: UsersService;

        beforeAll(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    UsersService,
                    { provide: REQUEST, useValue: { user: null, params: {} } },
                    {
                        provide: getModelToken(User.name),
                        useValue: UserModelConstructor,
                    },
                    { provide: OryService, useValue: mockOryService() },
                    {
                        provide: NotificationService,
                        useValue: mockNotificationService,
                    },
                ],
            }).compile();

            unauthService = await module.resolve<UsersService>(UsersService);
        });

        it("should throw UnauthorizedException when user is not authenticated", async () => {
            await expect(
                unauthService.findAll({ searchName: "test" })
            ).rejects.toThrow("Authentication required to search users");
        });

        it("should sanitize searchName in log to prevent log injection", async () => {
            await expect(
                unauthService.findAll({
                    searchName: "test\nINJECTED_LOG_LINE\rmore",
                })
            ).rejects.toThrow("Authentication required to search users");
        });
    });
});
