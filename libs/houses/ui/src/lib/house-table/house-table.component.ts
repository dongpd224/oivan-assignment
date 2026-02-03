import { Component, ViewChild, OnInit, OnChanges, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HouseModel, HouseStatus } from '../../../../domain/src';

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
export class HouseTableComponent implements OnInit, OnChanges {
  houses = input<HouseModel[]>([]);
  showEditActions = input<boolean>(false);
  showPagination = input<boolean>(true);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);
  totalItems = input<number>(0);

  viewDetails = output<HouseModel>();
  edit = output<HouseModel>();
  sortChange = output<Sort>();
  pageChange = output<PageEvent>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<HouseModel>();
  displayedColumns = ['houseNumber', 'houseType', 'houseModel', 'price', 'status', 'actions'];
  expandedHouse: HouseModel | null = null;
  houseStatus = HouseStatus;

  ngOnInit() {
    this.updateDataSource();
  }

  ngOnChanges() {
    this.updateDataSource();
  }

  private updateDataSource() {
    this.dataSource.data = this.houses();
    if (this.totalItems() === 0) {
      // Use the actual length of houses array if totalItems is not provided
    }
  }

  toggleExpansion(house: HouseModel) {
    this.expandedHouse = this.expandedHouse === house ? null : house;
  }

  isExpansionDetailRow = (i: number, row: Object) => {
    return row.hasOwnProperty('detailRow');
  };

  onViewDetails(house: HouseModel) {
    this.viewDetails.emit(house);
  }

  onEdit(house: HouseModel) {
    this.edit.emit(house);
  }

  onSortChange(sort: Sort) {
    this.sortChange.emit(sort);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}