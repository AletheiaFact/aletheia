import { LoggerService } from "@nestjs/common";
import * as winston from "winston";

export interface LogCategory {
    category: string;
    level: string;
    context?: string;
    requestId?: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    responseTime?: number;
    statusCode?: number;
}

export class WinstonLogger implements LoggerService {
    private logger: winston.Logger;

    constructor() {
        const isDevelopment = process.env.NODE_ENV !== 'production';

        // Development format - readable console output
        const developmentFormat = winston.format.combine(
            winston.format.timestamp({ format: 'HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.printf((info) => {
                const category = this.categorizeLog(info);
                const categoryColor = this.getCategoryColor(category);
                const levelColor = this.getLevelColor(info.level);
                
                let output = `${info.timestamp} ${levelColor}[${info.level.toUpperCase()}]${this.colors.reset} ${categoryColor}[${category.toUpperCase()}]${this.colors.reset}`;
                
                if (info.context) {
                    output += ` ${this.colors.cyan}${info.context}${this.colors.reset}:`;
                }
                
                output += ` ${info.message}`;
                
                if (info.trace) {
                    output += `\n${this.colors.red}${info.trace}${this.colors.reset}`;
                }
                
                return output;
            })
        );

        // Production format - structured JSON for CloudWatch
        const productionFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.printf((info) => {
                const logEntry = {
                    timestamp: info.timestamp,
                    level: info.level,
                    message: info.message,
                    category: this.categorizeLog(info),
                    ...info
                };
                
                // Remove redundant fields
                delete logEntry.timestamp;
                
                return JSON.stringify(logEntry);
            })
        );

        this.logger = winston.createLogger({
            format: isDevelopment ? developmentFormat : productionFormat,
            transports: [
                new winston.transports.Console()
            ],
        });
    }

    private colors = {
        reset: '\x1b[0m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        gray: '\x1b[90m',
        brightRed: '\x1b[91m',
        brightGreen: '\x1b[92m',
        brightYellow: '\x1b[93m',
        brightBlue: '\x1b[94m',
        brightMagenta: '\x1b[95m',
        brightCyan: '\x1b[96m'
    };

    private getLevelColor(level: string): string {
        switch (level) {
            case 'error': return this.colors.brightRed;
            case 'warn': return this.colors.brightYellow;
            case 'info': return this.colors.brightBlue;
            case 'debug': return this.colors.gray;
            case 'verbose': return this.colors.gray;
            default: return this.colors.white;
        }
    }

    private getCategoryColor(category: string): string {
        switch (category) {
            case 'security': return this.colors.red;
            case 'performance': return this.colors.yellow;
            case 'business': return this.colors.green;
            case 'http': return this.colors.cyan;
            case 'database': return this.colors.magenta;
            case 'system': return this.colors.blue;
            case 'external': return this.colors.brightMagenta;
            case 'error': return this.colors.brightRed;
            case 'application': return this.colors.white;
            default: return this.colors.gray;
        }
    }

    private categorizeLog(info: any): string {
        const { message, context, level, trace } = info;
        // Handle various message types safely
        let messageStr = '';
        if (typeof message === 'string') {
            messageStr = message;
        } else if (message !== null && message !== undefined) {
            try {
                messageStr = JSON.stringify(message);
            } catch (e) {
                messageStr = String(message);
            }
        }
        const contextStr = context || '';

        // Security events
        if (this.isSecurityEvent(messageStr, contextStr, level)) {
            return 'security';
        }

        // Performance events
        if (this.isPerformanceEvent(messageStr, contextStr, info)) {
            return 'performance';
        }

        // Business logic events
        if (this.isBusinessEvent(messageStr, contextStr)) {
            return 'business';
        }

        // HTTP requests
        if (this.isHttpEvent(messageStr, contextStr)) {
            return 'http';
        }

        // Database events
        if (this.isDatabaseEvent(messageStr, contextStr)) {
            return 'database';
        }

        // System events
        if (this.isSystemEvent(messageStr, contextStr, level)) {
            return 'system';
        }

        // External service events
        if (this.isExternalServiceEvent(messageStr, contextStr)) {
            return 'external';
        }

        // Application errors
        if (level === 'error' || trace) {
            return 'error';
        }

        // Default to application logs
        return 'application';
    }

    private isSecurityEvent(message: string, context: string, level: string): boolean {
        const securityKeywords = [
            'authentication', 'authorization', 'login', 'logout', 'token', 
            'csrf', 'xss', 'injection', 'vulnerability', 'attack', 'breach',
            'unauthorized', 'forbidden', 'session', 'captcha', 'brute force',
            'suspicious', 'malicious', 'security'
        ];
        
        const securityContexts = ['SessionGuard', 'NameSpaceGuard', 'M2MGuard', 'OryService', 'CaptchaService'];
        
        return this.containsKeywords(message, securityKeywords) || 
               this.containsKeywords(context, securityContexts) ||
               (level === 'warn' && this.containsKeywords(message, ['failed', 'denied', 'invalid']));
    }

    private isPerformanceEvent(message: string, context: string, info: any): boolean {
        const performanceKeywords = [
            'slow', 'timeout', 'performance', 'optimization', 'cache', 
            'memory', 'cpu', 'response time', 'latency', 'bottleneck'
        ];
        
        return this.containsKeywords(message, performanceKeywords) ||
               info.responseTime > 1000 || // Slow requests > 1s
               info.duration > 1000;
    }

    private isBusinessEvent(message: string, context: string): boolean {
        const businessKeywords = [
            'claim', 'review', 'personality', 'fact-check', 'verification',
            'source', 'user created', 'content published', 'review submitted',
            'notification sent', 'report generated'
        ];
        
        const businessContexts = [
            'ClaimService', 'ClaimReviewService', 'PersonalityService', 
            'ReviewTaskService', 'NotificationService', 'UserService'
        ];
        
        return this.containsKeywords(message, businessKeywords) ||
               this.containsKeywords(context, businessContexts);
    }

    private isHttpEvent(message: string, context: string): boolean {
        const httpPatterns = [
            /^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\s+/,
            /^\d{3}\s+/, // HTTP status codes
            /\/_next\//, // Next.js requests
            /\/api\//
        ];
        
        return context === 'HTTP' || 
               httpPatterns.some(pattern => pattern.test(message)) ||
               this.containsKeywords(message, ['request', 'response', 'endpoint']);
    }

    private isDatabaseEvent(message: string, context: string): boolean {
        const dbKeywords = [
            'mongodb', 'mongoose', 'database', 'connection', 'query',
            'insert', 'update', 'delete', 'find', 'aggregate', 'index',
            'migration', 'seed', 'collection'
        ];
        
        return this.containsKeywords(message, dbKeywords) ||
               context === 'MongooseModule' ||
               message.includes('Aletheia') && this.containsKeywords(message, ['connected', 'disconnected']);
    }

    private isSystemEvent(message: string, context: string, level: string): boolean {
        const systemKeywords = [
            'starting', 'listening', 'shutdown', 'restart', 'configuration',
            'environment', 'loaded env', 'compiled', 'build', 'startup',
            'initialization', 'module', 'service started'
        ];
        
        return this.containsKeywords(message, systemKeywords) ||
               context === 'Console' ||
               context === 'NestApplication' ||
               (level === 'info' && this.containsKeywords(message, ['PID', 'port']));
    }

    private isExternalServiceEvent(message: string, context: string): boolean {
        const externalKeywords = [
            'novu', 'openai', 'zenvia', 'aws', 's3', 'ory', 'gitlab',
            'webhook', 'api call', 'external service', 'third party',
            'integration', 'provider'
        ];
        
        const externalContexts = [
            'NovaService', 'FileManagementService', 'OryService',
            'CopilotService', 'NotificationService'
        ];
        
        return this.containsKeywords(message, externalKeywords) ||
               this.containsKeywords(context, externalContexts);
    }

    private containsKeywords(text: string | any, keywords: string[]): boolean {
        if (!text) return false;
        // Ensure text is a string
        const textStr = typeof text === 'string' ? text : String(text);
        const lowercaseText = textStr.toLowerCase();
        return keywords.some(keyword => lowercaseText.includes(keyword.toLowerCase()));
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace: string, context?: string) {
        this.logger.error(message, { trace, context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context });
    }
}
