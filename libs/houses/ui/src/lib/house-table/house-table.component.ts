import { Component, ViewChild, OnInit, OnChanges, AfterViewInit, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HouseDetailModel, HouseStatus } from '@oivan/houses/domain';
import { NumberFormatPipe } from '@oivan/shared/ui';

@Component({
  selector: 'lib-houses-house-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    NumberFormatPipe
  ],
  templateUrl: './house-table.component.html',
  styleUrl: './house-table.component.scss',
})
export class HouseTableComponent implements OnInit, OnChanges, AfterViewInit {
  houses = input<HouseDetailModel[]>([]);
  showEditActions = input<boolean>(false);
  showPagination = input<boolean>(true);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);
  totalItems = input<number>(0);

  viewDetails = output<HouseDetailModel>();
  edit = output<HouseDetailModel>();
  sortChange = output<Sort>();
  pageChange = output<PageEvent>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<HouseDetailModel>();

  displayedColumns = computed(() => {
    const baseColumn = ['houseNumber', 'blockNumber', 'landNumber', 'price', 'status'];
    if(this.showEditActions()) return [...baseColumn, 'actions'];
    else return baseColumn;
  })
  
  houseStatus = HouseStatus;

  ngOnInit() {
    this.updateDataSource();
  }

  ngOnChanges() {
    this.updateDataSource();
  }

  ngAfterViewInit() {
    this.setupDataSourceFeatures();
  }

  private setupDataSourceFeatures() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: HouseDetailModel, property: string) => {
      switch (property) {
        case 'houseNumber': return item.houseNumber;
        case 'blockNumber': return item.blockNumber;
        case 'landNumber': return item.landNumber;
        case 'price': return item.price;
        case 'status': return item.status;
        default: return '';
      }
    };
  }

  private updateDataSource() {
    this.dataSource.data = this.houses();
    // Re-assign sort after data changes to ensure sorting works
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  onViewDetails(house: HouseDetailModel) {
    this.viewDetails.emit(house);
  }

  onEdit(house: HouseDetailModel) {
    this.edit.emit(house);
  }

  onSortChange(sort: Sort) {
    this.sortChange.emit(sort);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}