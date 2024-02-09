import { Product } from '../../products/models';

export interface ElasticProduct extends Pick<Product, 'id' | 'name'> {}
