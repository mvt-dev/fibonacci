import DbModel from './DbModel';
import { Category } from '../interfaces/CategoryInterface';

/**
* Category model
*/
export default class CategoryModel extends DbModel {

  private table: string;

  constructor (table = 'category') {
    super({});
    this.table = table;
  }

  async list(): Promise<Category[]> {
    return this.db(this.table).orderBy('name');
  }

  async get(id: number): Promise<Category> {
    return this.db(this.table).where('id', id).first();
  }

  async create(category: Category): Promise<Category> {
    const result = await this.db(this.table).insert({
      name: category.name,
      color: category.color,
      tag: category.tag,
    }).returning([
      'id',
      'name',
      'color',
      'tag',
    ]);
    return result[0];
  }

  async update(category: Category): Promise<Category> {
    const result = await this.db(this.table).where('id', category.id).update({
      name: category.name,
      color: category.color,
      tag: category.tag,
    }).returning([
      'id',
      'name',
      'color',
      'tag',
    ]);
    return result[0];
  }

  async remove(id: number): Promise<void> {
    return this.db(this.table).where('id', id).del();
  }

}
