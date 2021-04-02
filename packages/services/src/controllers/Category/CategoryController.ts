import { CategoryInterface } from '@fibonacci/interfaces';
import CategoryModel from '../../models/Category';

/**
* Category controller
*/
export default class CategoryController {

  private categoryModel;

  constructor () {
    this.categoryModel = new CategoryModel();
  }

  async list(): Promise<CategoryInterface.Category[]> {
    return this.categoryModel.list();
  }

  async get(id: number): Promise<CategoryInterface.Category> {
    return this.categoryModel.get(id);
  }

  async create(category: CategoryInterface.Category): Promise<CategoryInterface.Category> {
    return this.categoryModel.create(category);
  }

  async update(category: CategoryInterface.Category): Promise<CategoryInterface.Category> {
    return this.categoryModel.update(category);
  }

  async remove(id: number): Promise<void> {
    await this.categoryModel.remove(id);
  }

}
