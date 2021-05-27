import { Asset } from '../interfaces/AssetInterface';
import AssetModel from '../models/AssetModel';

/**
* Asset controller
*/
export default class AssetController {

  private assetModel;

  constructor () {
    this.assetModel = new AssetModel();
  }

  async list(): Promise<Asset[]> {
    return this.assetModel.list();
  }

  async get(id: number): Promise<Asset> {
    return this.assetModel.get(id);
  }

  async create(asset: Asset): Promise<Asset> {
    return this.assetModel.create(asset);
  }

  async update(asset: Asset): Promise<Asset> {
    return this.assetModel.update(asset);
  }

  async remove(id: number): Promise<void> {
    await this.assetModel.remove(id);
  }

}
