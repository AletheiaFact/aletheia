import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import { ReviewTaskService } from './review-task.service';
import { ClaimReviewService } from '../claim-review/claim-review.service';
import { ReportService } from '../report/report.service';
import { HistoryService } from '../history/history.service';
import { StateEventService } from '../state-event/state-event.service';
import { SentenceService } from '../claim/types/sentence/sentence.service';
import { ImageService } from '../claim/types/image/image.service';
import { EditorParseService } from '../editor-parse/editor-parse.service';
import { CommentService } from './comment/comment.service';
import { NotificationService } from '../notifications/notifications.service';
import { ClaimService } from '../claim/claim.service';
import * as i18nUtil from '../utils/simple-i18n.util';

/**
 * ReviewTaskService Notification Unit Test Suite
 * 
 * Tests the server-side notification functionality integrated into the ReviewTaskService
 * for handling state-based notifications with proper URL generation and i18n support.
 * 
 * Business Context:
 * The ReviewTaskService now handles notification sending when review task states change,
 * replacing the unreliable frontend notification system. This ensures notifications
 * are sent consistently with correct URLs and translated messages.
 * 
 * Core Functionality:
 * - State-based notification triggers: assigned, reported, crossChecking, review, published
 * - URL generation: Proper claim-based URLs instead of kanban URLs
 * - i18n integration: Server-side translation of notification messages
 * - User filtering: Prevents self-notification and handles user role assignments
 * - Error handling: Graceful degradation when notification service unavailable
 * 
 * Notification Flow:
 * 1. Review task state change occurs (create/update)
 * 2. Service detects state transition and determines notification type
 * 3. Generates proper URL for the content being reviewed
 * 4. Translates notification message using locale from request
 * 5. Sends notifications to relevant users (excluding current user)
 * 6. Logs errors if notification sending fails
 */

describe('ReviewTaskService - Notification Functionality', () => {
    let service: ReviewTaskService;
    let notificationService: jest.Mocked<NotificationService>;
    let mockRequest: any;

    // Mock all dependencies
    const mockReviewTaskModel = {
        findById: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        updateOne: jest.fn(),
        countDocuments: jest.fn(),
        aggregate: jest.fn(),
    };

    const mockClaimReviewService = {
        create: jest.fn(),
    };

    const mockReportService = {
        create: jest.fn(),
    };

    const mockHistoryService = {
        getHistoryParams: jest.fn(),
        createHistory: jest.fn(),
    };

    const mockStateEventService = {
        getStateEventParams: jest.fn(),
        createStateEvent: jest.fn(),
    };

    const mockSentenceService = {
        getByDataHash: jest.fn(),
    };

    const mockImageService = {
        getByDataHash: jest.fn(),
    };

    const mockEditorParseService = {
        schema2editor: jest.fn(),
        schema2html: jest.fn(),
    };

    const mockCommentService = {
        create: jest.fn(),
        updateManyComments: jest.fn(),
    };

    const mockClaimService = {
        findById: jest.fn(),
    };

    beforeEach(async () => {
        // Create mock request object with language and user
        mockRequest = {
            language: 'en',
            user: {
                _id: 'current-user-id',
                role: { 'Main': 'Editor' }
            }
        };

        // Create mock notification service
        const mockNotificationService = {
            sendNotification: jest.fn(),
            novuIsConfigured: jest.fn().mockReturnValue(true),
            generateHmacHash: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewTaskService,
                {
                    provide: getModelToken('ReviewTask'),
                    useValue: mockReviewTaskModel,
                },
                {
                    provide: REQUEST,
                    useValue: mockRequest,
                },
                {
                    provide: ClaimReviewService,
                    useValue: mockClaimReviewService,
                },
                {
                    provide: ReportService,
                    useValue: mockReportService,
                },
                {
                    provide: HistoryService,
                    useValue: mockHistoryService,
                },
                {
                    provide: StateEventService,
                    useValue: mockStateEventService,
                },
                {
                    provide: SentenceService,
                    useValue: mockSentenceService,
                },
                {
                    provide: ImageService,
                    useValue: mockImageService,
                },
                {
                    provide: EditorParseService,
                    useValue: mockEditorParseService,
                },
                {
                    provide: CommentService,
                    useValue: mockCommentService,
                },
                {
                    provide: NotificationService,
                    useValue: mockNotificationService,
                },
                {
                    provide: ClaimService,
                    useValue: mockClaimService,
                },
            ],
        }).compile();

        service = await module.resolve<ReviewTaskService>(ReviewTaskService);
        notificationService = module.get(NotificationService) as jest.Mocked<NotificationService>;

        // Mock the i18n utility
        jest.spyOn(i18nUtil, 'getTranslation').mockImplementation((locale, key) => {
            const translations = {
                'notification:assignedUser': locale === 'en' 
                    ? 'You have been assigned to start a review'
                    : 'Você foi atribuído para começar uma revisão',
                'notification:reviewProgress': locale === 'en'
                    ? 'The review you are assigned to has progressed'
                    : 'A revisão na qual você esta atribuido(a) avançou',
                'notification:crossCheckingSubmit': locale === 'en'
                    ? 'The review has been sent for cross-checking'
                    : 'A revisão foi enviada para cross-checking',
                'notification:crossChecker': locale === 'en'
                    ? 'You have been selected as a cross-checker'
                    : 'Você foi selecionado como cross-checker',
                'notification:reviewSubmit': locale === 'en'
                    ? 'The review has been sent for review'
                    : 'A revisão foi enviada para revisão',
                'notification:reviewer': locale === 'en'
                    ? 'You have been selected as a reviewer'
                    : 'Você foi selecionado como revisor',
                'notification:reviewPublished': locale === 'en'
                    ? 'Your review has been published'
                    : 'Sua revisão foi publicada',
                'notification:reviewRejected': locale === 'en'
                    ? 'The review has been rejected'
                    : 'A revisão foi rejeitada',
            };
            return translations[key] || key;
        });

        // Mock environment variable
        process.env.BASE_URL = 'https://aletheiafact.org';
    });

    afterEach(() => {
        jest.clearAllMocks();
        delete process.env.BASE_URL;
    });

    describe('_generateNotificationUrl()', () => {
        /**
         * Test: Claim Content URL Generation - Proper Claim-Based URLs
         * 
         * Purpose: Validates correct URL generation for claim content (sentences)
         * Business Logic:
         * - Generates URLs in format: /claim/{slug}/sentence/{data_hash}
         * - Uses claim slug from target parameter for proper routing
         * - Includes namespace prefix when not 'Main'
         * - Replaces incorrect /kanban/sentence/ URLs with proper claim URLs
         * 
         * Test Data:
         * - Claim review task type with sentence content
         * - Claim slug as target parameter
         * - Namespace-specific URL formatting
         * 
         * Validates:
         * - Correct claim-based URL structure
         * - Proper namespace handling in URLs
         * - Claim slug integration for content routing
         * - Resolution of original URL generation problem
         */
        it('should generate correct claim-based URL for sentence content', async () => {
            const data_hash = 'test-sentence-hash';
            const nameSpace = 'test-environment';
            const reviewTaskType = 'Claim';
            const target = 'test-claim-slug';

            // Access private method through type assertion
            const url = await (service as any)._generateNotificationUrl(
                data_hash,
                nameSpace,
                reviewTaskType,
                target
            );

            expect(url).toBe('https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-sentence-hash');
        });

        /**
         * Test: Main Namespace URL Generation - Default Namespace Handling
         * 
         * Purpose: Validates URL generation for Main namespace (no prefix)
         * Business Logic:
         * - Omits namespace prefix when namespace is 'Main'
         * - Generates clean URLs without unnecessary namespace segments
         * - Maintains URL structure consistency across namespaces
         * - Handles default namespace scenario correctly
         * 
         * Test Data:
         * - Main namespace (default)
         * - Claim content with sentence type
         * - Expected URL without namespace prefix
         * 
         * Validates:
         * - Main namespace special handling
         * - Clean URL generation without prefix
         * - Consistent URL structure
         * - Default namespace behavior
         */
        it('should omit namespace prefix for Main namespace', async () => {
            const data_hash = 'test-sentence-hash';
            const nameSpace = 'Main';
            const reviewTaskType = 'Claim';
            const target = 'test-claim-slug';

            const url = await (service as any)._generateNotificationUrl(
                data_hash,
                nameSpace,
                reviewTaskType,
                target
            );

            expect(url).toBe('https://aletheiafact.org/claim/test-claim-slug/sentence/test-sentence-hash');
        });

        /**
         * Test: Source Content URL Generation - Source-Specific Routing
         * 
         * Purpose: Validates URL generation for source review tasks
         * Business Logic:
         * - Generates URLs in format: /source/{data_hash}
         * - Uses data_hash directly for source identification
         * - Handles different content types appropriately
         * - Supports source-specific review workflows
         * 
         * Test Data:
         * - Source review task type
         * - Source-specific URL pattern
         * - Namespace integration
         * 
         * Validates:
         * - Source-specific URL generation
         * - Data hash usage for source identification
         * - Content type-aware URL routing
         * - Source review workflow support
         */
        it('should generate correct URL for source content', async () => {
            const data_hash = 'test-source-hash';
            const nameSpace = 'test-environment';
            const reviewTaskType = 'Source';
            const target = 'unused-for-source';

            const url = await (service as any)._generateNotificationUrl(
                data_hash,
                nameSpace,
                reviewTaskType,
                target
            );

            expect(url).toBe('https://aletheiafact.org/test-environment/source/test-source-hash');
        });

        /**
         * Test: Verification Request URL Generation - Request-Specific Routing
         * 
         * Purpose: Validates URL generation for verification request tasks
         * Business Logic:
         * - Generates URLs in format: /verification-request/{data_hash}
         * - Supports verification request workflow
         * - Handles special review task types appropriately
         * - Enables proper routing for verification processes
         * 
         * Test Data:
         * - VerificationRequest task type
         * - Verification-specific URL pattern
         * - Request identification via data hash
         * 
         * Validates:
         * - Verification request URL generation
         * - Special task type handling
         * - Request-specific routing support
         * - Verification workflow integration
         */
        it('should generate correct URL for verification request', async () => {
            const data_hash = 'test-verification-hash';
            const nameSpace = 'test-environment';
            const reviewTaskType = 'VerificationRequest';
            const target = 'unused-for-verification';

            const url = await (service as any)._generateNotificationUrl(
                data_hash,
                nameSpace,
                reviewTaskType,
                target
            );

            expect(url).toBe('https://aletheiafact.org/test-environment/verification-request/test-verification-hash');
        });

        /**
         * Test: Default BASE_URL Handling - Environment Variable Fallback
         * 
         * Purpose: Validates URL generation when BASE_URL is not set
         * Business Logic:
         * - Uses default BASE_URL when environment variable not configured
         * - Maintains functionality regardless of environment configuration
         * - Provides sensible defaults for development environments
         * - Ensures consistent URL generation
         * 
         * Test Data:
         * - Missing BASE_URL environment variable
         * - Expected default URL generation
         * - Standard review task parameters
         * 
         * Validates:
         * - Environment variable fallback behavior
         * - Default URL configuration
         * - Consistent URL structure
         * - Development environment support
         */
        it('should use default BASE_URL when environment variable not set', async () => {
            const originalBaseUrl = process.env.BASE_URL;
            delete process.env.BASE_URL;

            const data_hash = 'test-hash';
            const nameSpace = 'test-environment';
            const reviewTaskType = 'Claim';
            const target = 'test-slug';

            const url = await (service as any)._generateNotificationUrl(
                data_hash,
                nameSpace,
                reviewTaskType,
                target
            );

            expect(url).toBe('https://aletheiafact.org/test-environment/claim/test-slug/sentence/test-hash');
            
            // Restore original environment variable
            if (originalBaseUrl) {
                process.env.BASE_URL = originalBaseUrl;
            }
        });
    });

    describe('_sendNotificationsForStateChange()', () => {
        const baseTestData = {
            previousState: 'pending',
            reviewData: {
                usersId: ['user1', 'user2'],
                crossCheckerId: 'crosscheck-user',
                reviewerId: 'reviewer-user'
            },
            data_hash: 'test-hash',
            nameSpace: 'test-environment',
            reviewTaskType: 'Claim',
            target: 'test-claim-slug',
            currentUserId: 'current-user-id'
        };

        /**
         * Test: Assigned State Notification - User Assignment Alerts
         * 
         * Purpose: Validates notification sending when users are assigned to review tasks
         * Business Logic:
         * - Sends notifications to all assigned users when state becomes 'assigned'
         * - Uses translated message for assignment notification
         * - Includes proper URL for accessing the assigned content
         * - Excludes current user from notifications to prevent self-notification
         * 
         * Test Data:
         * - State transition to 'assigned'
         * - Multiple assigned users in reviewData.usersId
         * - Expected translation key and URL generation
         * 
         * Validates:
         * - Assignment notification triggering
         * - Multi-user notification sending
         * - Translation integration for messages
         * - Self-notification prevention
         */
        it('should send notifications for assigned state', async () => {
            await (service as any)._sendNotificationsForStateChange(
                'pending',
                'assigned',
                baseTestData.reviewData,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                baseTestData.currentUserId
            );

            expect(notificationService.sendNotification).toHaveBeenCalledTimes(2);
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user1', {
                messageIdentifier: 'You have been assigned to start a review',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user2', {
                messageIdentifier: 'You have been assigned to start a review',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
        });

        /**
         * Test: Reported State Notification - Progress Updates
         * 
         * Purpose: Validates notification sending when review task is reported
         * Business Logic:
         * - Sends notifications to other assigned users (excluding current user)
         * - Uses progress-specific translated message
         * - Indicates review advancement to team members
         * - Maintains team awareness of review status
         * 
         * Test Data:
         * - State transition to 'reported'
         * - Current user excluded from notification list
         * - Progress notification message
         * 
         * Validates:
         * - Progress notification sending
         * - Current user exclusion logic
         * - Team awareness functionality
         * - State-specific message translation
         */
        it('should send notifications for reported state', async () => {
            await (service as any)._sendNotificationsForStateChange(
                'assigned',
                'reported',
                baseTestData.reviewData,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                'user1' // Current user is user1
            );

            expect(notificationService.sendNotification).toHaveBeenCalledTimes(1);
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user2', {
                messageIdentifier: 'The review you are assigned to has progressed',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
        });

        /**
         * Test: Cross-Checking State Notifications - Multi-Role Alert System
         * 
         * Purpose: Validates dual notification sending for cross-checking workflow
         * Business Logic:
         * - Sends progress notifications to assigned users (excluding current user)
         * - Sends specific cross-checker notification to designated cross-checker
         * - Supports multi-role notification pattern for workflow stages
         * - Enables role-specific messaging for different user types
         * 
         * Test Data:
         * - State transition to 'crossChecking'
         * - Both assigned users and specific cross-checker
         * - Different message types for different roles
         * 
         * Validates:
         * - Multi-role notification pattern
         * - Role-specific message differentiation
         * - Cross-checking workflow support
         * - Comprehensive team notification
         */
        it('should send notifications for crossChecking state', async () => {
            await (service as any)._sendNotificationsForStateChange(
                'reported',
                'crossChecking',
                baseTestData.reviewData,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                'user1' // Current user is user1
            );

            expect(notificationService.sendNotification).toHaveBeenCalledTimes(2);
            
            // Progress notification to other assigned users
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user2', {
                messageIdentifier: 'The review has been sent for cross-checking',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
            
            // Specific notification to cross-checker
            expect(notificationService.sendNotification).toHaveBeenCalledWith('crosscheck-user', {
                messageIdentifier: 'You have been selected as a cross-checker',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
        });

        /**
         * Test: Review State Notifications - Review Assignment Pattern
         * 
         * Purpose: Validates notification pattern for review state transitions
         * Business Logic:
         * - Notifies assigned users about review submission progress
         * - Alerts designated reviewer about their review assignment
         * - Maintains dual notification pattern for workflow transparency
         * - Supports reviewer selection and assignment workflow
         * 
         * Test Data:
         * - State transition to 'review'
         * - Assigned users and designated reviewer
         * - Review-specific notification messages
         * 
         * Validates:
         * - Review workflow notification support
         * - Reviewer assignment alerts
         * - Progress transparency for team
         * - Review state management
         */
        it('should send notifications for review state', async () => {
            await (service as any)._sendNotificationsForStateChange(
                'crossChecking',
                'review',
                baseTestData.reviewData,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                'user1' // Current user is user1
            );

            expect(notificationService.sendNotification).toHaveBeenCalledTimes(2);
            
            // Progress notification to other assigned users
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user2', {
                messageIdentifier: 'The review has been sent for review',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
            
            // Specific notification to reviewer
            expect(notificationService.sendNotification).toHaveBeenCalledWith('reviewer-user', {
                messageIdentifier: 'You have been selected as a reviewer',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
        });

        /**
         * Test: Published State Notification - Completion Alerts
         * 
         * Purpose: Validates notification sending when review is published
         * Business Logic:
         * - Notifies all assigned users about review publication
         * - Indicates successful completion of review process
         * - Provides closure notification for completed work
         * - Celebrates achievement and process completion
         * 
         * Test Data:
         * - State transition to 'published'
         * - All assigned users receive completion notification
         * - Publication-specific message content
         * 
         * Validates:
         * - Publication notification sending
         * - Completion workflow support
         * - Team-wide completion awareness
         * - Achievement recognition
         */
        it('should send notifications for published state', async () => {
            await (service as any)._sendNotificationsForStateChange(
                'review',
                'published',
                baseTestData.reviewData,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                baseTestData.currentUserId
            );

            expect(notificationService.sendNotification).toHaveBeenCalledTimes(2);
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user1', {
                messageIdentifier: 'Your review has been published',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user2', {
                messageIdentifier: 'Your review has been published',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
        });

        /**
         * Test: Rejection State Notification - Feedback Alerts
         * 
         * Purpose: Validates notification sending for review rejections
         * Business Logic:
         * - Notifies assigned users when review is rejected
         * - Provides feedback about needed changes
         * - Enables iterative improvement process
         * - Maintains communication during quality control
         * 
         * Test Data:
         * - State transition to rejection comment state
         * - Rejection-specific message content
         * - Feedback loop support
         * 
         * Validates:
         * - Rejection notification functionality
         * - Feedback communication support
         * - Quality control workflow
         * - Iterative improvement process
         */
        it('should send notifications for rejection state', async () => {
            await (service as any)._sendNotificationsForStateChange(
                'crossChecking',
                'addCommentCrossChecking',
                baseTestData.reviewData,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                baseTestData.currentUserId
            );

            expect(notificationService.sendNotification).toHaveBeenCalledTimes(2);
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user1', {
                messageIdentifier: 'The review has been rejected',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user2', {
                messageIdentifier: 'The review has been rejected',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
        });

        /**
         * Test: Portuguese Locale Support - Multilingual Notifications
         * 
         * Purpose: Validates Portuguese language support in notifications
         * Business Logic:
         * - Uses request locale for message translation
         * - Supports Portuguese language notifications
         * - Maintains functionality across different languages
         * - Provides localized user experience
         * 
         * Test Data:
         * - Portuguese locale in request
         * - Expected Portuguese translation
         * - Multilingual notification support
         * 
         * Validates:
         * - Portuguese language support
         * - Locale-aware notification sending
         * - Multilingual functionality
         * - Localized user experience
         */
        it('should use Portuguese locale for notifications', async () => {
            // Change request locale to Portuguese
            mockRequest.language = 'pt';

            await (service as any)._sendNotificationsForStateChange(
                'pending',
                'assigned',
                baseTestData.reviewData,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                baseTestData.currentUserId
            );

            expect(notificationService.sendNotification).toHaveBeenCalledWith('user1', {
                messageIdentifier: 'Você foi atribuído para começar uma revisão',
                redirectUrl: 'https://aletheiafact.org/test-environment/claim/test-claim-slug/sentence/test-hash'
            });
        });

        /**
         * Test: Self-Notification Prevention - User Experience Optimization
         * 
         * Purpose: Validates prevention of self-notifications
         * Business Logic:
         * - Excludes current user from notification recipient list
         * - Prevents unnecessary self-notifications
         * - Optimizes user experience by reducing notification noise
         * - Maintains focus on relevant team communications
         * 
         * Test Data:
         * - Current user in assigned users list
         * - Expected exclusion from notifications
         * - Other users still receive notifications
         * 
         * Validates:
         * - Self-notification prevention logic
         * - User experience optimization
         * - Relevant notification targeting
         * - Communication efficiency
         */
        it('should not send notifications to current user', async () => {
            const reviewDataWithCurrentUser = {
                usersId: ['current-user-id', 'user2'],
                crossCheckerId: 'crosscheck-user',
                reviewerId: 'reviewer-user'
            };

            await (service as any)._sendNotificationsForStateChange(
                'pending',
                'assigned',
                reviewDataWithCurrentUser,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                'current-user-id'
            );

            expect(notificationService.sendNotification).toHaveBeenCalledTimes(1);
            expect(notificationService.sendNotification).toHaveBeenCalledWith('user2', expect.any(Object));
            expect(notificationService.sendNotification).not.toHaveBeenCalledWith('current-user-id', expect.any(Object));
        });

        /**
         * Test: Notification Service Error Handling - Resilient Error Management
         * 
         * Purpose: Validates graceful handling of notification service errors
         * Business Logic:
         * - Catches and logs notification sending errors
         * - Continues system operation despite notification failures
         * - Prevents notification errors from breaking main functionality
         * - Provides error logging for system monitoring
         * 
         * Test Data:
         * - Simulated notification service error
         * - Expected error logging
         * - Continued system operation
         * 
         * Validates:
         * - Error resilience in notification system
         * - System stability during notification failures
         * - Error logging for monitoring
         * - Graceful degradation functionality
         */
        it('should handle notification service errors gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            notificationService.sendNotification.mockRejectedValue(new Error('Notification service error'));

            await (service as any)._sendNotificationsForStateChange(
                'pending',
                'assigned',
                baseTestData.reviewData,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                baseTestData.currentUserId
            );

            expect(consoleSpy).toHaveBeenCalledWith('Error sending notifications:', expect.any(Error));
            consoleSpy.mockRestore();
        });

        /**
         * Test: Novu Service Availability Check - Service Dependency Management
         * 
         * Purpose: Validates handling when Novu notification service is not configured
         * Business Logic:
         * - Checks if Novu service is properly configured before sending
         * - Skips notification sending when service unavailable
         * - Prevents errors from unconfigured notification infrastructure
         * - Enables graceful degradation when notifications disabled
         * 
         * Test Data:
         * - Novu service configured as unavailable
         * - Expected early return without notifications
         * - No notification sending attempts
         * 
         * Validates:
         * - Service availability checking
         * - Graceful degradation when service unavailable
         * - Configuration-aware operation
         * - Error prevention for unconfigured services
         */
        it('should skip notifications when Novu is not configured', async () => {
            notificationService.novuIsConfigured.mockReturnValue(false);

            await (service as any)._sendNotificationsForStateChange(
                'pending',
                'assigned',
                baseTestData.reviewData,
                baseTestData.data_hash,
                baseTestData.nameSpace,
                baseTestData.reviewTaskType,
                baseTestData.target,
                baseTestData.currentUserId
            );

            expect(notificationService.sendNotification).not.toHaveBeenCalled();
        });
    });
});