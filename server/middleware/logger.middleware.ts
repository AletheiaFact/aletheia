import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Extend Request type to include requestId
declare module 'express' {
  interface Request {
    requestId?: string;
    startTime?: number;
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { ip, method, originalUrl, path, route } = request;
    const userAgent = request.get('user-agent') || '';
    const requestId = (request.headers['x-request-id'] as string) || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Attach request ID and start time to request object for use in exception filters
    request.requestId = requestId;
    request.startTime = startTime;
    request.headers['x-request-id'] = requestId;
    response.setHeader('x-request-id', requestId);
    
    // Log incoming request
    this.logger.log(
      `→ ${method} ${originalUrl} | RequestId: ${requestId} | IP: ${ip} | Route: ${route?.path || path || 'unknown'}`
    );

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const responseTime = Date.now() - startTime;
      
      // Color code status for better visibility
      const statusSymbol = statusCode >= 500 ? '✗' : statusCode >= 400 ? '⚠' : '✓';

      // Enhanced response logging
      this.logger.log(
        `← ${statusSymbol} ${method} ${originalUrl} | Status: ${statusCode} | RequestId: ${requestId} | Time: ${responseTime}ms`,
        {
          requestId,
          method,
          url: originalUrl,
          statusCode,
          responseTime,
          contentLength,
          userAgent,
          ip,
          timestamp: new Date().toISOString(),
          // Add specific flags for categorization
          isStaticAsset: originalUrl.includes('/_next/') || 
                        originalUrl.includes('/static/') ||
                        /\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/.test(originalUrl),
          isApiCall: originalUrl.startsWith('/api/'),
          isSlowRequest: responseTime > 1000,
          isErrorResponse: statusCode >= 400
        }
      );
    });

    next();
  }
} 

