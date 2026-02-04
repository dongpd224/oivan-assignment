import { HouseDetailModel, HouseModelModel, GroupedHouseModel } from '@oivan/houses/domain';

/**
 * Groups houses by their model attribute, matching against available HouseModelModels.
 * Houses that don't match any model are excluded from the result.
 * 
 * @param houses - Array of houses to group
 * @param models - Array of available house models
 * @returns Array of GroupedHouseModel, one for each model that has matching houses
 */
export function groupHousesByModel(
  houses: HouseDetailModel[],
  models: HouseModelModel[]
): GroupedHouseModel[] {
  if (!houses || houses.length === 0 || !models || models.length === 0) {
    return [];
  }

  // Create a map of model name to HouseModelModel
  const modelMap = new Map<string, HouseModelModel>();
  models.forEach(model => {
    if (model.model) {
      modelMap.set(model.model, model);
    }
  });

  // Group houses by their model attribute
  const groupedMap = new Map<string, HouseDetailModel[]>();
  
  houses.forEach(house => {
    const modelName = house.model;
    if (modelName && modelMap.has(modelName)) {
      if (!groupedMap.has(modelName)) {
        groupedMap.set(modelName, []);
      }
      groupedMap.get(modelName)!.push(house);
    }
  });

  // Create GroupedHouseModel instances
  const result: GroupedHouseModel[] = [];
  
  groupedMap.forEach((houseList, modelName) => {
    const model = modelMap.get(modelName)!;
    result.push(new GroupedHouseModel(model, houseList));
  });

  return result;
}
