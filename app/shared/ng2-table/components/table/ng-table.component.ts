import {Component, EventEmitter, Input, Output, ViewContainerRef} from '@angular/core';
import {CORE_DIRECTIVES, NgClass} from '@angular/common';
import {NgTableSortingDirective} from './ng-table-sorting.directive';
import {Modal, BS_MODAL_PROVIDERS} from 'angular2-modal/plugins/bootstrap/index';

declare var $:any;

@Component({
  selector: 'ng-table',
  template: `
    <table class="table table-striped table-bordered table-hover dataTable"
           role="grid" style="width: 100%;">
      <thead>
      <tr role="row">
        <th *ngFor="let column of columns" data-html="true" [class]="getColumnClass(column)" [ngTableSorting]="config" [column]="column" (sortChanged)="onChangeTable($event)">
          {{column.title}}
          <i *ngIf="config && column.sort" class="pull-right fa"
            [ngClass]="{'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}"></i>
        </th>
      </tr>
      </thead>
      <tbody>      
      <tr [attr.id]="getRowTooltip(row)" *ngFor="let row of rows">
        <td *ngFor="let column of columns">
          <span style="display:inline-block; width:100%" *ngIf="!column.deleteRow && !column.editRow">{{getData(row, column.name)}}</span>
          <span style="display:inline-block; width:100%" *ngIf="column.editRow" (click)="onEditClick($event, row, column)"><i class="fa fa-edit"></i></span>
          <span style="display:inline-block; width:100%" *ngIf="column.deleteRow" (click)="onDeleteClick($event, row, column)"><i class="fa fa-remove"></i></span>          
        </td>
      </tr>
      </tbody>
    </table>
`,
  styles: ['.table-hover tbody tr:hover td, .table-hover tbody tr:hover th { color: #FFFFFF; background-color: #647299;}'],
  directives: [NgTableSortingDirective, NgClass, CORE_DIRECTIVES],
  viewProviders: [...BS_MODAL_PROVIDERS]
})
export class NgTableComponent {
  
  constructor(public modal: Modal, viewContainer: ViewContainerRef) {
      modal.defaultViewContainer = viewContainer;
  }
    
  // Table values
  @Input() public rows:Array<any> = [];
  @Input() public config:any = {};
  @Input() public rowTemplate: string = "";
  
  // Outputs (Events)
  @Output() public tableChanged:EventEmitter<any> = new EventEmitter();
  @Output() public deleteClicked:EventEmitter<any> = new EventEmitter();
  @Output() public editClicked:EventEmitter<any> = new EventEmitter();

  @Input()
  public set columns(values:Array<any>) {
    values.forEach((value:any) => {
      let column = this._columns.find((col:any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });
  }

  public getRowTooltip(row: any): string {
    var id = "R" + row.Id;
    $('#' + id).tooltip({
      delay: {show: 500, hide: 10} ,
      placement: 'top',
      html: true,
      template: `<div class="tooltip" style="display:inline-block; text-align:left;"><div class="tooltip-arrow" style="display:inline-block"></div>
        <div class="tooltip-inner" style="display:inline-block; max-width: 600px; text-align:left;color: #FFFFFF; background-color: #647299;"></div></div>`,
      title:(row && row.TooltipMessage) ? row.TooltipMessage : "" 
    });
    return id;
  }
  
  public getColumnClass(column) {
    return `col-xs-${column.colWidth}`;
  }
  
  
  public onEditClick(event, row, column) {
    event.preventDefault();
    event.stopPropagation();
    this.editClicked.emit(row);
  }
  
  public onDeleteClick(event, row, column) {
    event.preventDefault();
    event.stopPropagation();
    var msg = "Do you really want to delete this item?";
    if (column.deleteMessage) msg = column.deleteMessage;
    var box = this.modal.confirm().isBlocking(true).size('sm').message(msg).open();    
    box.then(resultPromise => {
      return resultPromise.result.then((result) => {
          this.deleteClicked.emit(row);
      });
    });
        
  }
  
  public get columns():Array<any> {
    return this._columns;
  }

  public get configColumns():any {
    let sortColumns:Array<any> = [];

    this.columns.forEach((column:any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return {columns: sortColumns};
  }

  private _columns:Array<any> = [];

  public onChangeTable(column:any):void {
    this._columns.forEach((col:any) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });
    this.tableChanged.emit({sorting: this.configColumns});
  }

  public getData(row:any, propertyName:string):string {
      
    var val = propertyName.split('.').reduce((prev:any, curr:string) => prev[curr], row);
    var colDef = this._columns.find(c => c.name == propertyName);
    if (colDef && colDef.transform) {
        val = colDef.transform(val);
    }
    return val;
  }
}