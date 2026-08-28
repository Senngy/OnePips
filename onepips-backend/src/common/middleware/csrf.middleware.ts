import {
    ForbiddenException,
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
    private readonly safeMethods = new Set([
        'GET',
        'HEAD',
        'OPTIONS',
    ]);

    use(
        req: Request,
        _res: Response,
        next: NextFunction,
    ): void {
        if (this.safeMethods.has(req.method)) {
            next();
            return;
        }

        const trustedOrigin =
            process.env.FRONT_URL || 'http://localhost:3000';

        const origin = req.headers.origin;

        const fetchSite = req.headers['sec-fetch-site'];

        if (origin && origin !== trustedOrigin) {
            throw new ForbiddenException({
                code: 'CSRF_ORIGIN_INVALID',
                message: 'Origine de la requête non autorisée.',
            });
        }

        if (fetchSite === 'cross-site') {
            throw new ForbiddenException({
                code: 'CSRF_FETCH_METADATA',
                message: 'Requête cross-site refusée.',
            });
        }

        next();
    }
}