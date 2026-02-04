# Requirements Document

## Introduction

Tính năng này cho phép nhóm các houses theo model tương ứng và hiển thị chúng trong giao diện accordion. Mỗi model sẽ là một expansion panel chứa thông tin media (title, video, banner, description) và bảng danh sách các houses thuộc model đó. Việc nhóm được thực hiện bằng cách so sánh `house.attributes.model` với `model.attributes.model`.

## Glossary

- **House**: Một đơn vị nhà ở với các thuộc tính như house_number, price, block_number, land_number, model, status
- **HouseModel**: Một loại mẫu nhà với thông tin media (title, video, banner, description) và định danh model
- **GroupedHouseModel**: Cấu trúc dữ liệu mới chứa thông tin HouseModel và danh sách các House thuộc model đó
- **Accordion_UI**: Giao diện Mat-Accordion của Angular Material để hiển thị các nhóm houses theo model
- **Expansion_Panel**: Mỗi panel trong accordion đại diện cho một HouseModel

## Requirements

### Requirement 1: Tạo Domain Model cho Grouped Houses

**User Story:** As a developer, I want to have a domain model that represents houses grouped by their model, so that I can easily manage and display grouped data.

#### Acceptance Criteria

1. THE GroupedHouseModel class SHALL contain a HouseModelModel property representing the model information
2. THE GroupedHouseModel class SHALL contain an array of HouseDetailModel representing houses belonging to that model
3. THE GroupedHouseModel class SHALL provide a method to get the count of houses in the group

### Requirement 2: Implement Grouping Logic trong Effect

**User Story:** As a developer, I want the loadHouses effect to group houses by their model, so that the UI can display houses organized by model categories.

#### Acceptance Criteria

1. WHEN the API returns houses and models data, THE House_Effect SHALL group houses by matching `house.model` with `model.model`
2. WHEN grouping houses, THE House_Effect SHALL create GroupedHouseModel instances for each unique model
3. WHEN a house's model does not match any HouseModel, THE House_Effect SHALL exclude that house from grouped results
4. WHEN grouping is complete, THE House_Effect SHALL dispatch a success action with both flat houses list and grouped houses list

### Requirement 3: Extend State để lưu trữ Grouped Houses

**User Story:** As a developer, I want the NgRx state to store grouped houses data, so that components can access grouped data through selectors.

#### Acceptance Criteria

1. THE House_State SHALL include a `groupedHouses` property of type `GroupedHouseModel[]`
2. WHEN loadHousesSuccess action is dispatched, THE House_Reducer SHALL update the `groupedHouses` state
3. THE House_Selectors SHALL provide a selector to retrieve grouped houses from state
4. THE House_Facade SHALL expose grouped houses as both Observable and Signal

### Requirement 4: Hiển thị Grouped Houses trong Accordion UI

**User Story:** As a user, I want to see houses organized by model in an accordion layout, so that I can easily browse houses by their model type.

#### Acceptance Criteria

1. WHEN the house list page loads, THE House_List_Component SHALL display houses in Mat-Accordion format
2. WHEN displaying accordion, THE Expansion_Panel header SHALL show the model name (house type)
3. WHEN an Expansion_Panel is expanded, THE UI SHALL display model media information (title, video, banner, description)
4. WHEN an Expansion_Panel is expanded, THE UI SHALL display a table of houses belonging to that model
5. WHEN user is authenticated, THE House_Table SHALL show Edit action column
6. WHEN user is not authenticated, THE House_Table SHALL hide Edit action column

### Requirement 5: Model Media Display trong Expansion Panel

**User Story:** As a user, I want to see detailed model information when I expand a model section, so that I can learn about the house model before viewing individual houses.

#### Acceptance Criteria

1. WHEN an Expansion_Panel is expanded, THE UI SHALL display the model media title prominently
2. WHEN an Expansion_Panel is expanded, THE UI SHALL display the model banner image
3. WHEN an Expansion_Panel is expanded, THE UI SHALL display the model description text
4. IF the model has a video URL, THEN THE UI SHALL display or link to the video content
5. THE media section SHALL be positioned above the houses table within the expansion panel

### Requirement 6: Maintain Existing Filter Functionality

**User Story:** As a user, I want to filter houses and see filtered results still grouped by model, so that I can find specific houses while maintaining the organized view.

#### Acceptance Criteria

1. WHEN a filter is applied, THE House_Effect SHALL apply the filter before grouping houses
2. WHEN filter results in empty groups, THE UI SHALL hide expansion panels with no houses
3. WHEN all filters are cleared, THE UI SHALL show all houses grouped by their models
