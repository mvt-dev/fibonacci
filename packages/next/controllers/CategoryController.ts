import { Category } from '../interfaces/CategoryInterface';
import CategoryModel from '../models/CategoryModel';

/**
* Category controller
*/
export default class CategoryController {

  private categoryModel;

  constructor () {
    this.categoryModel = new CategoryModel();
  }

  async list(): Promise<Category[]> {
    return this.categoryModel.list();
  }

  async get(id: number): Promise<Category> {
    return this.categoryModel.get(id);
  }

  async create(category: Category): Promise<Category> {
    return this.categoryModel.create(category);
  }

  async update(category: Category): Promise<Category> {
    return this.categoryModel.update(category);
  }

  async remove(id: number): Promise<void> {
    await this.categoryModel.remove(id);
  }

}
