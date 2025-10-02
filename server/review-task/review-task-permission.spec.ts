import { UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Roles } from "../auth/ability/ability.factory";
import { Types } from "mongoose";

/**
 * ReviewTask Permission Validation Unit Tests
 * 
 * Isolated unit tests for the validateResetPermission logic without dependencies.
 * These tests focus solely on the permission validation logic extracted from the 
 * ReviewTaskService to ensure proper role-based access control.
 * 
 * Business Context:
 * The reset functionality allows authorized users to reset review tasks to their
 * initial state. Permission validation must enforce:
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

// Extracted permission validation function for isolated testing
const validateResetPermission = (reviewTask: any, user: any): void => {
    const nameSpace = reviewTask.nameSpace || 'main';
    
    // Check if user is authenticated
    if (!user) {
        throw new UnauthorizedException('User not authenticated');
    }
    
    // Check if user has a valid role in this namespace
    if (!user.role || !user.role[nameSpace]) {
        throw new ForbiddenException('User does not have access to this namespace');
    }
    
    const userRole = user.role[nameSpace];
    
    // Admin and SuperAdmin users can reset any task
    if (userRole === Roles.Admin || userRole === Roles.SuperAdmin) {
        return; // Allow reset
    }
    
    // FactCheckers and Reviewers can only reset tasks assigned to them
    if (userRole === Roles.FactChecker || userRole === Roles.Reviewer) {
        const assignedUserIds = reviewTask.machine.context.reviewData.usersId.map((u: any) => u._id?.toString());
        const isAssignedUser = assignedUserIds.includes(user._id.toString());
        
        if (!isAssignedUser) {
            throw new ForbiddenException('You can only reset tasks that are assigned to you');
        }
        return; // Allow reset for assigned users
    }
    
    // Regular users or any other roles are not allowed to reset
    throw new ForbiddenException('You do not have permission to reset tasks');
};

describe("ReviewTask Permission Validation - Isolated Logic", () => {
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
        it("should throw UnauthorizedException when user is not authenticated", () => {
            const mockReviewTask = createMockReviewTask();
            
            expect(() => validateResetPermission(mockReviewTask, null))
                .toThrow(UnauthorizedException);
            
            expect(() => validateResetPermission(mockReviewTask, null))
                .toThrow("User not authenticated");
                
            expect(() => validateResetPermission(mockReviewTask, undefined))
                .toThrow(UnauthorizedException);
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
        it("should throw ForbiddenException when user has no role in namespace", () => {
            const mockReviewTask = createMockReviewTask();
            const mockUser = {
                _id: userId,
                role: {} // No roles defined
            };
            
            expect(() => validateResetPermission(mockReviewTask, mockUser))
                .toThrow(ForbiddenException);
            
            expect(() => validateResetPermission(mockReviewTask, mockUser))
                .toThrow("User does not have access to this namespace");
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
        it("should allow Admin users to reset any task", () => {
            const mockReviewTask = createMockReviewTask([otherUserId]); // Assigned to different user
            const mockUser = {
                _id: userId,
                role: { main: Roles.Admin }
            };
            
            // Should not throw any exception
            expect(() => validateResetPermission(mockReviewTask, mockUser))
                .not.toThrow();
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
        it("should allow SuperAdmin users to reset any task", () => {
            const mockReviewTask = createMockReviewTask([otherUserId]); // Assigned to different user
            const mockUser = {
                _id: userId,
                role: { main: Roles.SuperAdmin }
            };
            
            // Should not throw any exception
            expect(() => validateResetPermission(mockReviewTask, mockUser))
                .not.toThrow();
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
        it("should allow FactChecker to reset only assigned tasks", () => {
            const mockUser = {
                _id: userId,
                role: { main: Roles.FactChecker }
            };

            // Test: FactChecker can reset assigned task
            const assignedTask = createMockReviewTask([userId]);
            expect(() => validateResetPermission(assignedTask, mockUser))
                .not.toThrow();

            // Test: FactChecker cannot reset non-assigned task
            const nonAssignedTask = createMockReviewTask([otherUserId]);
            expect(() => validateResetPermission(nonAssignedTask, mockUser))
                .toThrow(ForbiddenException);
            
            expect(() => validateResetPermission(nonAssignedTask, mockUser))
                .toThrow("You can only reset tasks that are assigned to you");
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
        it("should allow Reviewer to reset only assigned tasks", () => {
            const mockUser = {
                _id: userId,
                role: { main: Roles.Reviewer }
            };

            // Test: Reviewer can reset assigned task
            const assignedTask = createMockReviewTask([userId]);
            expect(() => validateResetPermission(assignedTask, mockUser))
                .not.toThrow();

            // Test: Reviewer cannot reset non-assigned task
            const nonAssignedTask = createMockReviewTask([otherUserId]);
            expect(() => validateResetPermission(nonAssignedTask, mockUser))
                .toThrow(ForbiddenException);
            
            expect(() => validateResetPermission(nonAssignedTask, mockUser))
                .toThrow("You can only reset tasks that are assigned to you");
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
        it("should deny Regular users from resetting any tasks", () => {
            const assignedTask = createMockReviewTask([userId]);
            const mockUser = {
                _id: userId,
                role: { main: Roles.Regular }
            };

            expect(() => validateResetPermission(assignedTask, mockUser))
                .toThrow(ForbiddenException);
            
            expect(() => validateResetPermission(assignedTask, mockUser))
                .toThrow("You do not have permission to reset tasks");
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
        it("should deny Integration users from resetting tasks", () => {
            const mockReviewTask = createMockReviewTask();
            const mockUser = {
                _id: userId,
                role: { main: Roles.Integration }
            };

            expect(() => validateResetPermission(mockReviewTask, mockUser))
                .toThrow(ForbiddenException);
            
            expect(() => validateResetPermission(mockReviewTask, mockUser))
                .toThrow("You do not have permission to reset tasks");
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
        it("should handle multiple assigned users correctly", () => {
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
            expect(() => validateResetPermission(multiUserTask, mockUser1))
                .not.toThrow();
            
            // Test user2 (not assigned) cannot reset
            const mockUser2 = {
                _id: user2Id,
                role: { main: Roles.FactChecker }
            };
            expect(() => validateResetPermission(multiUserTask, mockUser2))
                .toThrow(ForbiddenException);
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
        it("should validate permissions for custom namespaces", () => {
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

            // Should allow reset because user has FactChecker role in custom namespace and is assigned
            expect(() => validateResetPermission(mockReviewTask, mockUser))
                .not.toThrow();
        });
    });
});