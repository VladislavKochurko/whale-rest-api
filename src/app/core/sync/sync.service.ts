// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Inject, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import { Cache } from 'cache-manager';
// import { ProductsCategory } from '../../products-categories/models';
// import { Product } from '../../products/models';
//
// @Injectable()
// export class SyncService {
//   constructor(
//     @Inject(CACHE_MANAGER) private redisCacheService: Cache,
//     @InjectModel(Product)
//     private readonly productModel: typeof Product,
//     @InjectModel(ProductsCategory)
//     private readonly productsCategoryModel: typeof ProductsCategory,
//   ) {}
//
//   async syncRedisAndPostgres() {
//     try {
//       const [products, categories] = await Promise.all([
//         this.productModel.findAll(),
//         this.productsCategoryModel.findAll(),
//       ]);
//       await Promise.all([
//         this.productModel.findAll(),
//         this.productsCategoryModel.findAll(),
//       ]).then(([products, categories]) => {
//         return Promise.all([
//           this.redisCacheService.set('products', products),
//           this.redisCacheService.set('categories', categories),
//         ]);
//       });
//
//     } catch (error) {
//       // Обработка ошибок
//     }
//   }
//
//   // Метод для обновления данных в кеше Redis при необходимости
//   async updateRedisCache(key: string) {
//     try {
//       // Получаем обновленные данные из PostgreSQL
//       const updatedData = await this.productsRepository.findAll(); // Пример
//
//       // Обновляем данные в Redis
//       await this.redisCacheService.set(key, updatedData);
//     } catch (error) {
//       // Обработка ошибок
//     }
//   }
// }
