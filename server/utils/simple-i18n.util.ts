import * as fs from 'fs';
import * as path from 'path';

/**
 * Simple translation cache to avoid repeated file reads
 */
const translationCache = new Map<string, any>();

/**
 * Simple translation utility for server-side i18n
 * Reads translation files from /public/locales/{locale}/{namespace}.json
 * 
 * @param locale - Language code (e.g., 'en', 'pt')
 * @param key - Translation key in format 'namespace:key' (e.g., 'notification:assignedUser')
 * @returns Translated string or original key if translation not found
 */
export function getTranslation(locale: string, key: string): string {
    try {
        // Parse namespace and key from format 'namespace:key'
        const [namespace, translationKey] = key.split(':');
        
        if (!namespace || !translationKey) {
            console.warn(`Invalid translation key format: ${key}. Expected 'namespace:key'`);
            return key;
        }

        const cacheKey = `${locale}:${namespace}`;
        
        // Check cache first
        if (!translationCache.has(cacheKey)) {
            const filePath = path.join(process.cwd(), 'public/locales', locale, `${namespace}.json`);
            
            try {
                if (!fs.existsSync(filePath)) {
                    console.warn(`Translation file not found: ${filePath}`);
                    return key; // Fallback to key
                }
                
                const content = fs.readFileSync(filePath, 'utf8');
                const translations = JSON.parse(content);
                translationCache.set(cacheKey, translations);
            } catch (fileError) {
                console.error(`Error reading translation file ${filePath}:`, fileError);
                return key; // Fallback to key
            }
        }
        
        const translations = translationCache.get(cacheKey);
        const translatedValue = translations?.[translationKey];
        
        if (!translatedValue) {
            console.warn(`Translation not found for key: ${key} in locale: ${locale}`);
            return key; // Fallback to key
        }
        
        return translatedValue;
    } catch (error) {
        console.error(`Error in getTranslation for key ${key}, locale ${locale}:`, error);
        return key; // Fallback to key
    }
}

/**
 * Clear the translation cache (useful for testing or hot reloading)
 * @param locale - Optional specific locale to clear, if not provided clears all
 */
export function clearTranslationCache(locale?: string): void {
    if (locale) {
        // Clear all entries for specific locale
        for (const [key] of translationCache) {
            if (key.startsWith(`${locale}:`)) {
                translationCache.delete(key);
            }
        }
    } else {
        // Clear entire cache
        translationCache.clear();
    }
}

/**
 * Get available locales by checking directory structure
 * @returns Array of available locale codes
 */
export function getAvailableLocales(): string[] {
    try {
        const localesPath = path.join(process.cwd(), 'public/locales');
        if (!fs.existsSync(localesPath)) {
            console.warn('Locales directory not found:', localesPath);
            return ['pt', 'en']; // Default fallback
        }
        
        return fs.readdirSync(localesPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();
    } catch (error) {
        console.error('Error reading locales directory:', error);
        return ['pt', 'en']; // Default fallback
    }
}