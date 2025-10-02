import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SqlInjectionPreventionMiddleware implements NestMiddleware {
  // Common SQL injection patterns to detect
  private sqlInjectionPatterns: RegExp[] = [
    // Basic SQL commands
    /(\s|^)(SELECT|INSERT INTO|UPDATE .* SET|DELETE FROM|DROP TABLE|ALTER TABLE|CREATE TABLE|EXEC|UNION SELECT|FROM .* WHERE)\s/i, // Comment markers
    /(--\s|\/\*.*\*\/)/i,
    // Common SQL injection techniques
    /(\s|^)(OR|AND)(\s+)(['"]?\w+['"]?\s*=\s*['"]?\w*['"]?)/i,
    // Attempts to end statements and inject new ones
    /;\s*(SELECT|INSERT|UPDATE|DELETE|DROP)/i,
    // UNION-based attacks
    /UNION\s+(ALL\s+)?SELECT/i,
    // Blind SQL injection attempts
    /SLEEP\(\d+\)/i,
    /BENCHMARK\(\d+,\w+\)/i,
    // Batched queries
    /;\s*WAITFOR\s+DELAY/i,
  ];

  // Character escaping map for SQL
  private sqlEscapeMap: Record<string, string> = {
    "'": "''",
    '"': '""',
    '\\': '\\\\',
    '\0': '\\0',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\x1a': '\\Z', // ASCII 26 (Ctrl+Z)
  };

  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Deep copy the request body, query and params to avoid modifying the original objects directly
      // if (req.body && typeof req.body === 'object') {
      //   this.sanitizeObject(req.body);
      //   this.checkForSqlInjection(req.body, req.path);
      // }

      if (req.query && typeof req.query === 'object') {
        this.sanitizeObject(req.query);
        this.checkForSqlInjection(req.query, req.path);
      }

      if (req.params && typeof req.params === 'object') {
        this.sanitizeObject(req.params);
        this.checkForSqlInjection(req.params, req.path);
      }

      next();
    } catch (error) {
      res.status(403).json({
        statusCode: 403,
        message: 'Potential SQL injection attack detected',
        error: error?.message,
      });
    }
  }

  private checkForSqlInjection(obj: object, path: string): void {
    // Convert object to string for pattern matching
    const objString = JSON.stringify(obj);

    // Test against SQL injection patterns
    for (const pattern of this.sqlInjectionPatterns) {
      if (pattern.test(objString)) {
        console.warn(
          `Potential SQL injection detected at ${path}:`,
          objString,
          '\nMatched Pattern:',
          pattern.toString(),
        );
        throw new Error('SQL injection attempt detected');
      }
    }
  }

  private sanitizeObject(obj: object): void {
    if (!obj || typeof obj !== 'object') {
      return;
    }

    // Recursively sanitize all string values in the object
    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      // Sanitize string values
      if (typeof value === 'string') {
        obj[key] = this.escapeSql(value);
      }
      // Recursively sanitize nested objects
      else if (value && typeof value === 'object') {
        this.sanitizeObject(value);
      }
    });
  }

  private escapeSql(value: string): string {
    // Replace special characters with their escaped versions
    return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      return this.sqlEscapeMap[char] || char;
    });
  }
}
