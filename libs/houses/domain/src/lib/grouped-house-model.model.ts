import { HouseModelModel } from './house-model.model';
import { HouseDetailModel } from './house.model';

/**
 * GroupedHouseModel represents a collection of houses grouped by their model.
 * Each instance contains a HouseModelModel and an array of HouseDetailModel
 * that belong to that model.
 */
export class GroupedHouseModel {
  model: HouseModelModel;
  houses: HouseDetailModel[];

  constructor(model: HouseModelModel, houses: HouseDetailModel[] = []) {
    this.model = model;
    this.houses = houses;
  }

  get housesCount(): number {
    return this.houses.length;
  }

  get modelName(): string {
    return this.model.model;
  }

  get mediaTitle(): string {
    return this.model.media?.title || '';
  }

  get mediaBanner(): string {
    return this.model.media?.banner || '';
  }

  get mediaVideo(): string {
    return this.model.media?.video || '';
  }

  get mediaDescription(): string {
    return this.model.media?.description || '';
  }

  hasVideo(): boolean {
    return !!this.model.media?.video;
  }
}
