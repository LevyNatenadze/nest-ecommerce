import {SetMetadata} from '@nestjs/common';

export const AutorizeRoles = (...roles: string[]) => SetMetadata('allowedRoles', roles);