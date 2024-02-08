import { MappingTypeMapping } from '@elastic/elasticsearch/lib/api/types';

export const productMapping = {
  properties: {
    id: { type: 'keyword' },
    name: { type: 'text' },
  },
} as MappingTypeMapping;
