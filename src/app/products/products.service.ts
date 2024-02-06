import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { UpdateResult } from "../common";
import { CreateProductDto, UpdateProductDto } from "./dto";
import { Product } from "./entities";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product
  ) {
  }

  public create({ name, slug }: CreateProductDto): Promise<Product> {
    return this.productModel.create({
      name,
      slug
    });
  }

  public findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  public findOne(id: string): Promise<Product> {
    console.log("ID", id)
    return this.productModel.findByPk(id);
  }

  public update(id: string, updateProductDto: UpdateProductDto): UpdateResult<Product> {
    return this.productModel.update(updateProductDto, { where: { id } });
  }

  public remove(id: string): Promise<number> {
    return this.productModel.destroy({ where: { id } });
  }
}
