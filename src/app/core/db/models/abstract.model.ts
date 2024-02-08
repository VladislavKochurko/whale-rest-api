import { BeforeCreate, Column, DataType, Model } from 'sequelize-typescript';
import slugify from 'slugify';

export class AbstractModel extends Model {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column
  slug: string;

  @Column
  name: string;

  @BeforeCreate
  static async generateSlug(instance: AbstractModel): Promise<void> {
    instance.slug = slugify(instance.name, { lower: true });
  }
}
