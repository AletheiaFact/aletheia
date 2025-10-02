import { Test, TestingModule } from "@nestjs/testing";
import { ReviewTaskService } from "./review-task.service";
import { REQUEST } from "@nestjs/core";
import { UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Roles } from "../auth/ability/ability.factory";
import { MongoMemoryServer } from "mongodb-memory-server";
import { AppModule } from "../app.module";
import { TestConfigOptions } from "../tests/utils/TestConfigOptions";
import { Types } from "mongoose";

/**
 * ReviewTaskService Unit Test Suite
 * 
 * Tests the review task permission validation system, specifically focusing
 * on the validateResetPermission method that enforces role-based access control
 * for the reset functionality.
 * 
 * Business Context:
 * The reset functionality allows authorized users to reset review tasks to their
 * initial state. This is a privileged operation that must be carefully controlled:
 * - Admin and SuperAdmin users can reset any task
 * - FactCheckers and Reviewers can only reset tasks assigned to them
 * - Regular users cannot reset any tasks
 * 
 * Test Coverage:
 * - Authentication validation
 * - Namespace access control
 * - Role-based permission validation
 * - Assignment-based permission validation for non-admin users
 * - Error handling and appropriate exception throwing
 */
describe("ReviewTaskService - Permission Validation", () => {
    let service: ReviewTaskService;
    let db: any;
    let moduleFixture: TestingModule;

    // Mock review task document with typical structure
    const createMockReviewTask = (assignedUserIds: string[] = []) => ({
        nameSpace: "main",
        machine: {
            context: {
                reviewData: {
                    usersId: assignedUserIds.map(id => ({ _id: id }))
                }
            }
        }
    });

    // Mock request objects for different user roles
    const createMockRequest = (user: any) => ({
        user
    });

    beforeAll(async () => {
        db = await MongoMemoryServer.create({ instance: { port: 35026 } });
        const mongoUri = db.getUri();
        
        const testConfig = {
            ...TestConfigOptions.config,
            db: {
                ...TestConfigOptions.config.db,
                connection_uri: mongoUri,
            },
        };

        moduleFixture = await Test.createTestingModule({
            imports: [AppModule.register(testConfig)],
        }).compile();

        service = moduleFixture.get<ReviewTaskService>(ReviewTaskService);
    });

    afterAll(async () => {
        if (moduleFixture) {
            await moduleFixture.close();
        }
        if (db) {
            await db.stop();
        }
    });

    describe("validateResetPermission", () => {
        const userId = new Types.ObjectId().toString();
        const otherUserId = new Types.ObjectId().toString();
        
        /**
         * Test: Authentication Validation
         * 
         * Purpose: Ensures unauthenticated requests are rejected
         * Business Logic: All reset operations require authentication
         * 
         * Validates:
         * - UnauthorizedException thrown for null user
         * - UnauthorizedException thrown for undefined user
         * - Proper error message for authentication failures
         */
        it("should throw UnauthorizedException when user is not authenticated", async () => {
            const mockReviewTask = createMockReviewTask();
            const mockRequest = createMockRequest(null);
            
            // Mock the request object
            const mockServiceWithRequest = Object.create(service);
            mockServiceWithRequest.req = mockRequest;

            await expect(
                mockServiceWithRequest.validateResetPermission(mockReviewTask)
            ).rejects.toThrow(UnauthorizedException);
            
            await expect(
                mockServiceWithRequest.validateResetPermission(mockReviewTask)
            ).rejects.toThrow("User not authenticated");
        });

        /**
         * Test: Namespace Access Control
         * 
         * Purpose: Validates namespace-based access control
         * Business Logic: Users must have a valid role in the task's namespace
         * 
         * Validates:
         * - ForbiddenException for missing namespace role
         * - ForbiddenException for empty role object
         * - Proper error message for namespace access failures
         */
        it("should throw ForbiddenException when user has no role in namespace", async () => {
            const mockReviewTask = createMockReviewTask();
            const mockUser = {
                _id: userId,
                role: {} // No roles defined
            };
            const mockRequest = createMockRequest(mockUser);
            
            const mockServiceWithRequest = Object.create(service);
            mockServiceWithRequest.req = mockRequest;

            await expect(
                mockServiceWithRequest.validateResetPermission(mockReviewTask)
            ).rejects.toThrow(ForbiddenException);
            
            await expect(
                mockServiceWithRequest.validateResetPermission(mockReviewTask)
            ).rejects.toThrow("User does not have access to this namespace");
        });

        /**
         * Test: Admin Permission Validation
         * 
         * Purpose: Validates that Admin users can reset any task
         * Business Logic: Admin role grants unrestricted reset permissions
         * 
         * Validates:
         * - Admin can reset tasks they are not assigned to
         * - Admin can reset tasks in their authorized namespace
         * - No exceptions thrown for valid admin operations
         */
        it("should allow Admin users to reset any task", async () => {
            const mockReviewTask = createMockReviewTask([otherUserId]); // Assigned to different user
            const mockUser = {
                _id: userId,
                role: { main: Roles.Admin }
            };
            const mockRequest = createMockRequest(mockUser);
            
            const mockServiceWithRequest = Object.create(service);
            mockServiceWithRequest.req = mockRequest;

            // Should not throw any exception
            await expect(
                mockServiceWithRequest.validateResetPermission(mockReviewTask)
            ).resolves.toBeUndefined();
        });

        /**
         * Test: SuperAdmin Permission Validation
         * 
         * Purpose: Validates that SuperAdmin users can reset any task
         * Business Logic: SuperAdmin role grants unrestricted reset permissions
         * 
         * Validates:
         * - SuperAdmin can reset tasks they are not assigned to
         * - SuperAdmin can reset tasks in their authorized namespace
         * - No exceptions thrown for valid SuperAdmin operations
         */
        it("should allow SuperAdmin users to reset any task", async () => {
            const mockReviewTask = createMockReviewTask([otherUserId]); // Assigned to different user
            const mockUser = {
                _id: userId,
                role: { main: Roles.SuperAdmin }
            };
            const mockRequest = createMockRequest(mockUser);
            
            const mockServiceWithRequest = Object.create(service);
            mockServiceWithRequest.req = mockRequest;

            // Should not throw any exception
            await expect(
                mockServiceWithRequest.validateResetPermission(mockReviewTask)
            ).resolves.toBeUndefined();
        });

        /**
         * Test: FactChecker Assignment-Based Permission
         * 
         * Purpose: Validates FactChecker can only reset assigned tasks
         * Business Logic: FactCheckers have restricted permissions based on assignment
         * 
         * Validates:
         * - FactChecker can reset tasks they are assigned to
         * - FactChecker cannot reset tasks they are not assigned to
         * - Proper exception handling for unauthorized operations
         */
        it("should allow FactChecker to reset only assigned tasks", async () => {
            // Test: FactChecker can reset assigned task
            const assignedTask = createMockReviewTask([userId]);
            const mockUser = {
                _id: userId,
                role: { main: Roles.FactChecker }
            };
            const mockRequest = createMockRequest(mockUser);
            
            const mockServiceWithRequest = Object.create(service);
            mockServiceWithRequest.req = mockRequest;

            // Should allow reset of assigned task
            await expect(
                mockServiceWithRequest.validateResetPermission(assignedTask)
            ).resolves.toBeUndefined();

            // Test: FactChecker cannot reset non-assigned task
            const nonAssignedTask = createMockReviewTask([otherUserId]);
            
            await expect(
                mockServiceWithRequest.validateResetPermission(nonAssignedTask)
            ).rejects.toThrow(ForbiddenException);
            
            await expect(
                mockServiceWithRequest.validateResetPermission(nonAssignedTask)
            ).rejects.toThrow("You can only reset tasks that are assigned to you");
        });

        /**
         * Test: Reviewer Assignment-Based Permission
         * 
         * Purpose: Validates Reviewer can only reset assigned tasks
         * Business Logic: Reviewers have restricted permissions based on assignment
         * 
         * Validates:
         * - Reviewer can reset tasks they are assigned to
         * - Reviewer cannot reset tasks they are not assigned to
         * - Consistent behavior with FactChecker role
         */
        it("should allow Reviewer to reset only assigned tasks", async () => {
            // Test: Reviewer can reset assigned task
            const assignedTask = createMockReviewTask([userId]);
            const mockUser = {
                _id: userId,
                role: { main: Roles.Reviewer }
            };
            const mockRequest = createMockRequest(mockUser);
            
            const mockServiceWithRequest = Object.create(service);
            mockServiceWithRequest.req = mockRequest;

            // Should allow reset of assigned task
            await expect(
                mockServiceWithRequest.validateResetPermission(assignedTask)
            ).resolves.toBeUndefined();

            // Test: Reviewer cannot reset non-assigned task
            const nonAssignedTask = createMockReviewTask([otherUserId]);
            
            await expect(
                mockServiceWithRequest.validateResetPermission(nonAssignedTask)
            ).rejects.toThrow(ForbiddenException);
            
            await expect(
                mockServiceWithRequest.validateResetPermission(nonAssignedTask)
            ).rejects.toThrow("You can only reset tasks that are assigned to you");
        });

        /**
         * Test: Regular User Permission Denial
         * 
         * Purpose: Validates Regular users cannot reset any tasks
         * Business Logic: Regular users have no reset permissions
         * 
         * Validates:
         * - Regular users blocked even for assigned tasks
         * - Regular users blocked for any task operation
         * - Appropriate permission denied message
         */
        it("should deny Regular users from resetting any tasks", async () => {
            // Regular user should be denied even for "assigned" tasks
            const assignedTask = createMockReviewTask([userId]);
            const mockUser = {
                _id: userId,
                role: { main: Roles.Regular }
            };
            const mockRequest = createMockRequest(mockUser);
            
            const mockServiceWithRequest = Object.create(service);
            mockServiceWithRequest.req = mockRequest;

            await expect(
                mockServiceWithRequest.validateResetPermission(assignedTask)
            ).rejects.toThrow(ForbiddenException);
            
            await expect(
                mockServiceWithRequest.validateResetPermission(assignedTask)
            ).rejects.toThrow("You do not have permission to reset tasks");
        });

        /**
         * Test: Integration User Permission Denial
         * 
         * Purpose: Validates Integration users cannot reset tasks
         * Business Logic: Integration role is for API access, not task management
         * 
         * Validates:
         * - Integration users have no reset permissions
         * - Consistent denial across all task scenarios
         * - Proper permission boundary enforcement
         */
        it("should deny Integration users from resetting tasks", async () => {
            const mockReviewTask = createMockReviewTask();
            const mockUser = {
                _id: userId,
                role: { main: Roles.Integration }
            };
            const mockRequest = createMockRequest(mockUser);
            
            const mockServiceWithRequest = Object.create(service);
            mockServiceWithRequest.req = mockRequest;

            await expect(
                mockServiceWithRequest.validateResetPermission(mockReviewTask)
            ).rejects.toThrow(ForbiddenException);
            
            await expect(
                mockServiceWithRequest.validateResetPermission(mockReviewTask)
            ).rejects.toThrow("You do not have permission to reset tasks");
        });

        /**
         * Test: Multi-User Assignment Validation
         * 
         * Purpose: Validates assignment checking with multiple assigned users
         * Business Logic: Tasks can have multiple assigned users
         * 
         * Validates:
         * - User found in multi-user assignment list
         * - User not found in multi-user assignment list
         * - Proper array-based assignment validation
         */
        it("should handle multiple assigned users correctly", async () => {
            const user1Id = new Types.ObjectId().toString();
            const user2Id = new Types.ObjectId().toString();
            const user3Id = new Types.ObjectId().toString();
            
            // Task assigned to user1 and user3, but not user2
            const multiUserTask = createMockReviewTask([user1Id, user3Id]);
            
            // Test user1 (assigned) can reset
            const mockUser1 = {
                _id: user1Id,
                role: { main: Roles.FactChecker }
            };
            const mockRequest1 = createMockRequest(mockUser1);
            const mockServiceWithRequest1 = Object.create(service);
            mockServiceWithRequest1.req = mockRequest1;

            await expect(
                mockServiceWithRequest1.validateResetPermission(multiUserTask)
            ).resolves.toBeUndefined();
            
            // Test user2 (not assigned) cannot reset
            const mockUser2 = {
                _id: user2Id,
                role: { main: Roles.FactChecker }
            };
            const mockRequest2 = createMockRequest(mockUser2);
            const mockServiceWithRequest2 = Object.create(service);
            mockServiceWithRequest2.req = mockRequest2;

            await expect(
                mockServiceWithRequest2.validateResetPermission(multiUserTask)
            ).rejects.toThrow(ForbiddenException);
        });

        /**
         * Test: Custom Namespace Validation
         * 
         * Purpose: Validates permission checking across different namespaces
         * Business Logic: Permissions are namespace-specific
         * 
         * Validates:
         * - User with role in custom namespace
         * - User without role in custom namespace
         * - Namespace isolation and access control
         */
        it("should validate permissions for custom namespaces", async () => {
            const customNamespace = "custom-org";
            const mockReviewTask = {
                nameSpace: customNamespace,
                machine: {
                    context: {
                        reviewData: {
                            usersId: [{ _id: userId }]
                        }
                    }
                }
            };
            
            // User with role in custom namespace
            const mockUser = {
                _id: userId,
                role: { 
                    main: Roles.Regular,
                    [customNamespace]: Roles.FactChecker
                }
            };
            const mockRequest = createMockRequest(mockUser);
            const mockServiceWithRequest = Object.create(service);
            mockServiceWithRequest.req = mockRequest;

            // Should allow reset because user has FactChecker role in custom namespace and is assigned
            await expect(
                mockServiceWithRequest.validateResetPermission(mockReviewTask)
            ).resolves.toBeUndefined();
        });
    });
});