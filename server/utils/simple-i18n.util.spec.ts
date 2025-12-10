import * as fs from 'fs';
import * as path from 'path';
import { getTranslation, clearTranslationCache, getAvailableLocales } from './simple-i18n.util';

/**
 * Simple I18n Utility Unit Test Suite
 * 
 * Tests the server-side translation utility that provides basic i18n functionality
 * for the notification system without full i18n infrastructure.
 * 
 * Business Context:
 * This utility serves as a Phase 0 hotfix to enable server-side translation of
 * notification messages while the comprehensive i18n infrastructure is being
 * developed. It reads translation files from the existing frontend i18n structure.
 * 
 * Core Functionality:
 * - Translation key resolution: namespace:key format (e.g., 'notification:assignedUser')
 * - File system access: Reads JSON files from /public/locales/{locale}/{namespace}.json
 * - Caching strategy: Memory-based cache to avoid repeated file reads
 * - Fallback behavior: Returns original key if translation not found
 * - Error handling: Graceful degradation for missing files or invalid keys
 * 
 * Data Flow:
 * 1. Parse translation key into namespace and key components
 * 2. Check memory cache for previously loaded translations
 * 3. Load translation file from filesystem if not cached
 * 4. Return translated value or fallback to original key
 * 5. Log warnings for missing translations or files
 */

// Mock console methods to test logging
const mockConsoleWarn = jest.fn();
const mockConsoleError = jest.fn();

// Mock fs methods
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock path.join to control file paths in tests
jest.mock('path', () => ({
    join: jest.fn((...args) => args.join('/')),
}));

// Mock process.cwd() to return a predictable path
const originalCwd = process.cwd;

describe('Simple I18n Utility', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        clearTranslationCache();
        
        // Mock console methods
        global.console.warn = mockConsoleWarn;
        global.console.error = mockConsoleError;
        
        // Mock process.cwd()
        process.cwd = jest.fn(() => '/test/project');
    });

    afterEach(() => {
        // Restore original process.cwd
        process.cwd = originalCwd;
    });

    describe('getTranslation()', () => {
        /**
         * Test: Basic Translation Key Resolution - Success Path
         * 
         * Purpose: Validates successful translation of valid keys from existing files
         * Business Logic:
         * - Parses 'namespace:key' format correctly
         * - Loads translation file from expected filesystem location
         * - Returns translated string value for valid keys
         * - Caches translation data for subsequent requests
         * 
         * Test Data:
         * - Locale: 'en' (English)
         * - Key: 'notification:assignedUser'
         * - Expected file path: /test/project/public/locales/en/notification.json
         * - Translation content: { "assignedUser": "You have been assigned to start a review" }
         * 
         * Validates:
         * - Correct file path generation and reading
         * - Successful JSON parsing of translation content
         * - Accurate translation value retrieval
         * - No error or warning messages logged
         */
        it('should return translated string for valid key', () => {
            const mockTranslations = {
                'assignedUser': 'You have been assigned to start a review'
            };
            
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockTranslations));

            const result = getTranslation('en', 'notification:assignedUser');

            expect(result).toBe('You have been assigned to start a review');
            expect(mockFs.existsSync).toHaveBeenCalledWith('/test/project/public/locales/en/notification.json');
            expect(mockFs.readFileSync).toHaveBeenCalledWith('/test/project/public/locales/en/notification.json', 'utf8');
            expect(mockConsoleWarn).not.toHaveBeenCalled();
            expect(mockConsoleError).not.toHaveBeenCalled();
        });

        /**
         * Test: Portuguese Translation Support - Multilingual Functionality
         * 
         * Purpose: Validates Portuguese language translation support
         * Business Logic:
         * - Supports multiple locales beyond English
         * - Loads correct translation file for specified locale
         * - Returns properly translated Portuguese text
         * - Maintains consistent functionality across locales
         * 
         * Test Data:
         * - Locale: 'pt' (Portuguese)
         * - Key: 'notification:reviewProgress'
         * - Expected file: /test/project/public/locales/pt/notification.json
         * - Portuguese translation: "A revisão na qual você esta atribuido(a) avançou"
         * 
         * Validates:
         * - Multi-locale file path generation
         * - Portuguese language character handling
         * - Consistent translation logic across languages
         * - Proper encoding support for special characters
         */
        it('should return Portuguese translation for pt locale', () => {
            const mockTranslations = {
                'reviewProgress': 'A revisão na qual você esta atribuido(a) avançou'
            };
            
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockTranslations));

            const result = getTranslation('pt', 'notification:reviewProgress');

            expect(result).toBe('A revisão na qual você esta atribuido(a) avançou');
            expect(mockFs.existsSync).toHaveBeenCalledWith('/test/project/public/locales/pt/notification.json');
        });

        /**
         * Test: Translation Caching Mechanism - Performance Optimization
         * 
         * Purpose: Validates memory caching prevents repeated file system access
         * Business Logic:
         * - Caches translation data after first file read
         * - Subsequent requests use cached data instead of file system
         * - Improves performance by avoiding repeated JSON parsing
         * - Maintains cache consistency across multiple translation requests
         * 
         * Test Data:
         * - Multiple requests for same locale/namespace combination
         * - Verification that file system access occurs only once
         * - Cache hit validation for subsequent requests
         * 
         * Validates:
         * - File system access optimization (single read per namespace)
         * - Cache hit behavior for subsequent requests
         * - Consistent results from cached vs. fresh data
         * - Memory efficiency through intelligent caching
         */
        it('should use cache for subsequent requests', () => {
            const mockTranslations = {
                'assignedUser': 'You have been assigned to start a review',
                'reviewProgress': 'The review has progressed'
            };
            
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockTranslations));

            // First request - should read from file
            const result1 = getTranslation('en', 'notification:assignedUser');
            expect(result1).toBe('You have been assigned to start a review');
            expect(mockFs.readFileSync).toHaveBeenCalledTimes(1);

            // Second request for same namespace - should use cache
            const result2 = getTranslation('en', 'notification:reviewProgress');
            expect(result2).toBe('The review has progressed');
            expect(mockFs.readFileSync).toHaveBeenCalledTimes(1); // Still only called once
        });

        /**
         * Test: Multiple Namespace Support - Modular Translation Organization
         * 
         * Purpose: Validates support for multiple translation namespaces
         * Business Logic:
         * - Different namespaces load separate translation files
         * - Cache management per namespace to avoid conflicts
         * - Supports modular organization of translation keys
         * - Enables separation of concerns in translation management
         * 
         * Test Data:
         * - Notification namespace: notification:assignedUser
         * - Common namespace: common:timeNow
         * - Different file paths and translation content
         * 
         * Validates:
         * - Separate file loading for different namespaces
         * - Independent caching per namespace
         * - No cross-namespace contamination
         * - Proper namespace-to-file mapping
         */
        it('should handle multiple namespaces correctly', () => {
            const mockNotificationTranslations = {
                'assignedUser': 'You have been assigned to start a review'
            };
            const mockCommonTranslations = {
                'timeNow': 'now'
            };

            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync
                .mockReturnValueOnce(JSON.stringify(mockNotificationTranslations))
                .mockReturnValueOnce(JSON.stringify(mockCommonTranslations));

            const result1 = getTranslation('en', 'notification:assignedUser');
            const result2 = getTranslation('en', 'common:timeNow');

            expect(result1).toBe('You have been assigned to start a review');
            expect(result2).toBe('now');
            expect(mockFs.existsSync).toHaveBeenCalledWith('/test/project/public/locales/en/notification.json');
            expect(mockFs.existsSync).toHaveBeenCalledWith('/test/project/public/locales/en/common.json');
            expect(mockFs.readFileSync).toHaveBeenCalledTimes(2);
        });
    });

    describe('Fallback and Error Handling', () => {
        /**
         * Test: Missing Translation Key Fallback - Graceful Degradation
         * 
         * Purpose: Validates fallback behavior when translation key doesn't exist
         * Business Logic:
         * - Returns original key when translation not found in file
         * - Logs warning message for missing translation
         * - Maintains system stability despite missing translations
         * - Provides clear indication of missing translation for debugging
         * 
         * Test Data:
         * - Valid file with limited translation keys
         * - Request for non-existent key in valid namespace
         * - Expected fallback to original key format
         * 
         * Validates:
         * - Graceful handling of missing translation keys
         * - Warning log generation for missing translations
         * - Original key preservation for fallback
         * - System stability during translation failures
         */
        it('should return original key when translation not found', () => {
            const mockTranslations = {
                'existingKey': 'Existing translation'
            };
            
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockTranslations));

            const result = getTranslation('en', 'notification:nonExistentKey');

            expect(result).toBe('notification:nonExistentKey');
            expect(mockConsoleWarn).toHaveBeenCalledWith('Translation not found for key: notification:nonExistentKey in locale: en');
        });

        /**
         * Test: Missing Translation File Handling - File System Resilience
         * 
         * Purpose: Validates handling when translation file doesn't exist
         * Business Logic:
         * - Gracefully handles missing translation files
         * - Returns original key as fallback when file not found
         * - Logs warning about missing file for administrator awareness
         * - Prevents system crashes due to file system issues
         * 
         * Test Data:
         * - File system mock returning false for file existence
         * - Valid translation key format but missing file
         * - Expected fallback behavior and warning generation
         * 
         * Validates:
         * - Resilient file system error handling
         * - Appropriate warning messages for missing files
         * - Fallback key preservation
         * - System stability during file system failures
         */
        it('should return original key when translation file not found', () => {
            mockFs.existsSync.mockReturnValue(false);

            const result = getTranslation('en', 'notification:assignedUser');

            expect(result).toBe('notification:assignedUser');
            expect(mockConsoleWarn).toHaveBeenCalledWith('Translation file not found: /test/project/public/locales/en/notification.json');
            expect(mockFs.readFileSync).not.toHaveBeenCalled();
        });

        /**
         * Test: Invalid Translation Key Format - Input Validation
         * 
         * Purpose: Validates handling of malformed translation key formats
         * Business Logic:
         * - Detects invalid key format (missing namespace separator)
         * - Returns original input as fallback for invalid format
         * - Logs warning about expected format for developer guidance
         * - Maintains system stability with invalid input
         * 
         * Test Data:
         * - Invalid key formats: no separator, multiple separators, empty parts
         * - Expected warning messages with format guidance
         * - Fallback to original input string
         * 
         * Validates:
         * - Input format validation and error handling
         * - Clear developer guidance through warning messages
         * - Robust handling of malformed input
         * - System stability with invalid key formats
         */
        it('should return original key for invalid key format', () => {
            const result1 = getTranslation('en', 'invalidFormat');
            const result2 = getTranslation('en', ':emptyNamespace');
            const result3 = getTranslation('en', 'emptyKey:');

            expect(result1).toBe('invalidFormat');
            expect(result2).toBe(':emptyNamespace');
            expect(result3).toBe('emptyKey:');
            
            expect(mockConsoleWarn).toHaveBeenCalledWith('Invalid translation key format: invalidFormat. Expected \'namespace:key\'');
            expect(mockConsoleWarn).toHaveBeenCalledWith('Invalid translation key format: :emptyNamespace. Expected \'namespace:key\'');
            expect(mockConsoleWarn).toHaveBeenCalledWith('Invalid translation key format: emptyKey:. Expected \'namespace:key\'');
        });

        /**
         * Test: File Read Error Handling - I/O Exception Resilience
         * 
         * Purpose: Validates handling of file system read errors
         * Business Logic:
         * - Gracefully handles file system read exceptions
         * - Returns original key when file read fails
         * - Logs detailed error information for debugging
         * - Maintains system stability during I/O failures
         * 
         * Test Data:
         * - File system mock throwing read error
         * - Valid file existence but read failure
         * - Expected error logging and fallback behavior
         * 
         * Validates:
         * - I/O exception handling and recovery
         * - Detailed error logging for troubleshooting
         * - Fallback key preservation during errors
         * - System resilience to file system issues
         */
        it('should handle file read errors gracefully', () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockImplementation(() => {
                throw new Error('File read permission denied');
            });

            const result = getTranslation('en', 'notification:assignedUser');

            expect(result).toBe('notification:assignedUser');
            expect(mockConsoleError).toHaveBeenCalledWith(
                'Error reading translation file /test/project/public/locales/en/notification.json:',
                expect.any(Error)
            );
        });

        /**
         * Test: JSON Parse Error Handling - Malformed Content Resilience
         * 
         * Purpose: Validates handling of malformed JSON in translation files
         * Business Logic:
         * - Gracefully handles invalid JSON content in translation files
         * - Returns original key when JSON parsing fails
         * - Logs parsing error for content correction
         * - Prevents system crashes from malformed translation files
         * 
         * Test Data:
         * - Valid file with invalid JSON content
         * - JSON parse error simulation
         * - Expected error handling and fallback
         * 
         * Validates:
         * - JSON parsing error recovery
         * - Content validation and error reporting
         * - Fallback behavior for malformed files
         * - System stability with corrupted translation data
         */
        it('should handle JSON parse errors gracefully', () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue('{ invalid json content');

            const result = getTranslation('en', 'notification:assignedUser');

            expect(result).toBe('notification:assignedUser');
            expect(mockConsoleError).toHaveBeenCalledWith(
                'Error reading translation file /test/project/public/locales/en/notification.json:',
                expect.any(Error)
            );
        });

        /**
         * Test: General Exception Handling - Comprehensive Error Recovery
         * 
         * Purpose: Validates handling of unexpected errors in translation process
         * Business Logic:
         * - Catches and handles any unexpected errors in translation pipeline
         * - Returns original key as safe fallback for any error condition
         * - Logs comprehensive error information for debugging
         * - Ensures system stability regardless of error type
         * 
         * Test Data:
         * - Simulated unexpected error in translation process
         * - Comprehensive error logging validation
         * - Fallback behavior verification
         * 
         * Validates:
         * - Comprehensive error handling coverage
         * - Consistent fallback behavior for all error types
         * - Detailed error logging for problem diagnosis
         * - System resilience to unexpected failures
         */
        it('should handle unexpected errors gracefully', () => {
            // Mock an error in the translation process
            mockFs.existsSync.mockImplementation(() => {
                throw new Error('Unexpected filesystem error');
            });

            const result = getTranslation('en', 'notification:assignedUser');

            expect(result).toBe('notification:assignedUser');
            expect(mockConsoleError).toHaveBeenCalledWith(
                'Error reading translation file /test/project/public/locales/en/notification.json:',
                expect.any(Error)
            );
        });
    });

    describe('clearTranslationCache()', () => {
        /**
         * Test: Specific Locale Cache Clearing - Targeted Cache Management
         * 
         * Purpose: Validates selective cache clearing for specific locales
         * Business Logic:
         * - Clears cache entries only for specified locale
         * - Preserves cache entries for other locales
         * - Enables targeted cache invalidation for locale updates
         * - Maintains performance for unaffected locales
         * 
         * Test Data:
         * - Multiple locales with cached translation data
         * - Selective clearing of single locale
         * - Verification of cache state after clearing
         * 
         * Validates:
         * - Precise locale-specific cache clearing
         * - Cache preservation for other locales
         * - Effective cache invalidation
         * - Performance optimization through selective clearing
         */
        it('should clear cache for specific locale', () => {
            const mockTranslations = {
                'assignedUser': 'Test translation'
            };
            
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockTranslations));

            // Load translations for multiple locales
            getTranslation('en', 'notification:assignedUser');
            getTranslation('pt', 'notification:assignedUser');
            
            // Verify files were read
            expect(mockFs.readFileSync).toHaveBeenCalledTimes(2);
            
            // Clear cache for English only
            clearTranslationCache('en');
            
            // Request English translation again - should read from file
            getTranslation('en', 'notification:assignedUser');
            expect(mockFs.readFileSync).toHaveBeenCalledTimes(3);
            
            // Request Portuguese translation - should use cache
            getTranslation('pt', 'notification:assignedUser');
            expect(mockFs.readFileSync).toHaveBeenCalledTimes(3); // Still 3, no additional read
        });

        /**
         * Test: Complete Cache Clearing - Full Cache Reset
         * 
         * Purpose: Validates complete cache clearing for all locales
         * Business Logic:
         * - Clears all cached translation data when no locale specified
         * - Forces fresh file reads for all subsequent requests
         * - Enables complete cache reset for system updates
         * - Provides clean slate for translation reloading
         * 
         * Test Data:
         * - Multiple locales and namespaces in cache
         * - Complete cache clearing operation
         * - Verification of full cache invalidation
         * 
         * Validates:
         * - Complete cache invalidation functionality
         * - Fresh file loading after cache clear
         * - Comprehensive cache reset behavior
         * - System-wide translation refresh capability
         */
        it('should clear entire cache when no locale specified', () => {
            const mockTranslations = {
                'assignedUser': 'Test translation'
            };
            
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify(mockTranslations));

            // Load translations for multiple locales
            getTranslation('en', 'notification:assignedUser');
            getTranslation('pt', 'notification:assignedUser');
            
            // Verify files were read
            expect(mockFs.readFileSync).toHaveBeenCalledTimes(2);
            
            // Clear entire cache
            clearTranslationCache();
            
            // Both requests should read from file again
            getTranslation('en', 'notification:assignedUser');
            getTranslation('pt', 'notification:assignedUser');
            expect(mockFs.readFileSync).toHaveBeenCalledTimes(4);
        });
    });

    describe('getAvailableLocales()', () => {
        /**
         * Test: Locale Directory Discovery - Available Language Detection
         * 
         * Purpose: Validates discovery of available locales from filesystem
         * Business Logic:
         * - Reads locale directories from /public/locales/
         * - Returns sorted list of available locale codes
         * - Filters out non-directory entries
         * - Provides system-wide locale availability information
         * 
         * Test Data:
         * - Mock directory structure with locale folders
         * - Mixed file types (directories and files)
         * - Expected filtered and sorted locale list
         * 
         * Validates:
         * - Correct directory path scanning
         * - Directory filtering from file entries
         * - Locale code extraction and sorting
         * - Available locale enumeration functionality
         */
        it('should return available locales from directory structure', () => {
            const mockDirEntries = [
                { name: 'en', isDirectory: () => true },
                { name: 'pt', isDirectory: () => true },
                { name: 'config.json', isDirectory: () => false }, // Should be filtered out
            ];
            
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readdirSync.mockReturnValue(mockDirEntries as any);

            const result = getAvailableLocales();

            expect(result).toEqual(['en', 'pt']);
            expect(mockFs.existsSync).toHaveBeenCalledWith('/test/project/public/locales');
            expect(mockFs.readdirSync).toHaveBeenCalledWith('/test/project/public/locales', { withFileTypes: true });
        });

        /**
         * Test: Missing Locales Directory Fallback - Default Language Support
         * 
         * Purpose: Validates fallback behavior when locales directory doesn't exist
         * Business Logic:
         * - Returns default locales when directory not found
         * - Provides Portuguese and English as fallback languages
         * - Logs warning about missing locales directory
         * - Ensures basic language support even without directory structure
         * 
         * Test Data:
         * - File system mock returning false for directory existence
         * - Expected default locale list ['pt', 'en']
         * - Warning message about missing directory
         * 
         * Validates:
         * - Graceful handling of missing locales directory
         * - Default language fallback functionality
         * - Warning generation for missing directory
         * - Basic language support guarantee
         */
        it('should return default locales when directory not found', () => {
            mockFs.existsSync.mockReturnValue(false);

            const result = getAvailableLocales();

            expect(result).toEqual(['pt', 'en']);
            expect(mockConsoleWarn).toHaveBeenCalledWith('Locales directory not found:', '/test/project/public/locales');
        });

        /**
         * Test: Directory Read Error Handling - I/O Resilience
         * 
         * Purpose: Validates handling of directory read errors
         * Business Logic:
         * - Gracefully handles directory read exceptions
         * - Returns default locales when directory read fails
         * - Logs error information for system administration
         * - Maintains basic functionality during filesystem issues
         * 
         * Test Data:
         * - Directory read operation throwing error
         * - Expected default locale fallback
         * - Error logging verification
         * 
         * Validates:
         * - I/O error resilience for directory operations
         * - Default locale fallback during errors
         * - Comprehensive error logging
         * - System stability during filesystem failures
         */
        it('should handle directory read errors gracefully', () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readdirSync.mockImplementation(() => {
                throw new Error('Permission denied');
            });

            const result = getAvailableLocales();

            expect(result).toEqual(['pt', 'en']);
            expect(mockConsoleError).toHaveBeenCalledWith(
                'Error reading locales directory:',
                expect.any(Error)
            );
        });
    });
});