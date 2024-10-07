import { SetMetadata } from '@nestjs/common';

// Create a constant to hold the public metadata key
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
