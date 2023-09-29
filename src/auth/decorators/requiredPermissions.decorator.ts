import {SetMetadata} from '@nestjs/common'
export const REQUIRED_PERMISSIONS_KEY = 'required_permissions'
export const RequiredPermissions = (...permissions:string[])=> SetMetadata(REQUIRED_PERMISSIONS_KEY,permissions);