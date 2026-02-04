// House Model Model (represents house_models from API)
export enum HOUSE_MODEL_MAPPING_FIELD {
  id = 'id',
  type = 'type',
  links = 'links',
  attributes = 'attributes'
}

export enum HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD {
  model = 'model',
  media = 'media',
  houseType = 'house_type'
}

export enum HOUSE_MODEL_MEDIA_MAPPING_FIELD {
  title = 'title',
  video = 'video',
  banner = 'banner',
  description = 'description'
}

export interface HouseModelLinks {
  self: string;
}

export interface HouseModelMedia {
  title: string;
  video: string;
  banner: string;
  description: string;
}

export interface HouseModelConvertToReqBody {
  [HOUSE_MODEL_MAPPING_FIELD.id]: string;
  [HOUSE_MODEL_MAPPING_FIELD.type]: string;
  [HOUSE_MODEL_MAPPING_FIELD.links]: HouseModelLinks;
  [HOUSE_MODEL_MAPPING_FIELD.attributes]: {
    [HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD.model]: string;
    [HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD.media]: HouseModelMedia;
    [HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD.houseType]: string;
  };
}

export class HouseModelModel {
  id!: string;
  type!: string;
  links!: HouseModelLinks;
  model!: string;
  media!: HouseModelMedia;
  houseType!: string;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.id = respObject.id;
      this.type = respObject.type;
      this.links = respObject.links;
      this.model = respObject.model;
      this.media = respObject.media;
      this.houseType = respObject.houseType;
    }
  }

  private parseFromBackend(respObject: any) {
    this.id = respObject[HOUSE_MODEL_MAPPING_FIELD.id];
    this.type = respObject[HOUSE_MODEL_MAPPING_FIELD.type];
    this.links = respObject[HOUSE_MODEL_MAPPING_FIELD.links];
    
    const attributes = respObject[HOUSE_MODEL_MAPPING_FIELD.attributes];
    if (attributes) {
      this.model = attributes[HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD.model];
      this.media = attributes[HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD.media];
      this.houseType = attributes[HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD.houseType];
    }
  }

  public convertToReqBody(): HouseModelConvertToReqBody {
    return {
      [HOUSE_MODEL_MAPPING_FIELD.id]: this.id,
      [HOUSE_MODEL_MAPPING_FIELD.type]: this.type,
      [HOUSE_MODEL_MAPPING_FIELD.links]: this.links,
      [HOUSE_MODEL_MAPPING_FIELD.attributes]: {
        [HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD.model]: this.model,
        [HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD.media]: this.media,
        [HOUSE_MODEL_ATTRIBUTES_MAPPING_FIELD.houseType]: this.houseType
      }
    };
  }
}
