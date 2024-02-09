import { CacheNamespace } from '../../core/cache/cache.constants';

export const ALL_KEY = '*';
export const getCacheKey = (prefix: CacheNamespace, id: string) => `${prefix}.${id}`;
