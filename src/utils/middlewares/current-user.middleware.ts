
import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private readonly userService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeaders = req.headers.authorization || req.headers.Authorization;
        if(!authHeaders || isArray(authHeaders) || !authHeaders.startsWith('Bearer ')) {
            req.currentUser = null;
            next();
        } else {
            const token = authHeaders.split(' ')[1];
            try {
                const decoded = verify(token, process.env.JSON_WEB_TOKEN_SECRET) as { id: string };
                const currentUser = await this.userService.findOne(+decoded.id);
                req.currentUser = currentUser;
            } catch (error) {
                console.error('JWT verification failed:', error.message);
            }
            next();
        }
    }
}
