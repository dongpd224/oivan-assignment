import { Component, ViewChild, OnInit, OnChanges, AfterViewInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HouseDetailModel, HouseStatus } from '../../../../domain/src';

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
    MatChipsModule
  ],
  templateUrl: './house-table.component.html',
  styleUrl: './house-table.component.scss',
  animations: [
    // Add expansion animation here if needed
  ]
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
  displayedColumns = ['houseNumber', 'houseType', 'houseModel', 'price', 'status', 'actions'];
  houseStatus = HouseStatus;

  ngOnInit() {
    this.updateDataSource();
  }

  ngOnChanges() {
    this.updateDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: HouseDetailModel, property: string) => {
      switch (property) {
        case 'houseNumber': return item.getFullHouseNumber();
        case 'houseType': return item.houseType;
        case 'houseModel': return item.model;
        case 'price': return item.price;
        case 'status': return item.status;
        default: return '';
      }
    };
  }

  private updateDataSource() {
    this.dataSource.data = this.houses();
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