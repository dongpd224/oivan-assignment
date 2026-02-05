import { HouseDetailModel, HouseModelModel, GroupedHouseModel } from '@oivan/houses/domain';

const OTHER_MODEL_NAME = 'Other';

/**
 * Creates a placeholder "Other" model for houses that don't match any known model.
 */
function createOtherModel(): HouseModelModel {
  return new HouseModelModel({
    id: 'other',
    type: 'house_models',
    links: { self: '' },
    model: OTHER_MODEL_NAME,
    media: {
      title: OTHER_MODEL_NAME,
      video: '',
      banner: '',
      description: 'Houses with unknown or unmatched models'
    },
    houseType: ''
  }, false);
}

/**
 * Groups houses by their model attribute, matching against available HouseModelModels.
 * - All models are returned, even if no houses match them
 * - Houses with models not in the list are grouped under "Other"
 * 
 * @param houses - Array of houses to group
 * @param models - Array of available house models
 * @returns Array of GroupedHouseModel, one for each model plus "Other" if needed
 */
export function groupHousesByModel(
  houses: HouseDetailModel[],
  models: HouseModelModel[]
): GroupedHouseModel[] {
  // If no models, return empty array
  if (!models || models.length === 0) {
    return [];
  }

  // Create a map of model name to HouseModelModel
  const modelMap = new Map<string, HouseModelModel>();
  models.forEach(model => {
    if (model.model) {
      modelMap.set(model.model, model);
    }
  });

  // Initialize grouped map with all models (empty arrays)
  const groupedMap = new Map<string, HouseDetailModel[]>();
  models.forEach(model => {
    if (model.model) {
      groupedMap.set(model.model, []);
    }
  });

  // Track houses that don't match any model
  const otherHouses: HouseDetailModel[] = [];

  // Group houses by their model attribute
  if (houses && houses.length > 0) {
    houses.forEach(house => {
      const modelName = house.model;
      if (modelName && modelMap.has(modelName)) {
        groupedMap.get(modelName)!.push(house);
      } else {
        // House has no model or model not in list -> add to "Other"
        otherHouses.push(house);
      }
    });
  }

  // Create GroupedHouseModel instances for all models
  const result: GroupedHouseModel[] = [];
  
  models.forEach(model => {
    if (model.model) {
      const houseList = groupedMap.get(model.model) || [];
      result.push(new GroupedHouseModel(model, houseList));
    }
  });

  // Add "Other" group if there are unmatched houses
  if (otherHouses.length > 0) {
    result.push(new GroupedHouseModel(createOtherModel(), otherHouses));
  }

  return result;
}
