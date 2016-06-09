System.register(['@angular/core', '@angular/common', './ng-table-sorting.directive', 'angular2-modal/plugins/bootstrap/index'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, ng_table_sorting_directive_1, index_1;
    var NgTableComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (ng_table_sorting_directive_1_1) {
                ng_table_sorting_directive_1 = ng_table_sorting_directive_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            NgTableComponent = (function () {
                function NgTableComponent(modal, viewContainer) {
                    this.modal = modal;
                    // Table values
                    this.rows = [];
                    this.config = {};
                    this.rowTemplate = "";
                    // Outputs (Events)
                    this.tableChanged = new core_1.EventEmitter();
                    this.deleteClicked = new core_1.EventEmitter();
                    this.editClicked = new core_1.EventEmitter();
                    this._columns = [];
                    modal.defaultViewContainer = viewContainer;
                }
                Object.defineProperty(NgTableComponent.prototype, "columns", {
                    get: function () {
                        return this._columns;
                    },
                    set: function (values) {
                        var _this = this;
                        values.forEach(function (value) {
                            var column = _this._columns.find(function (col) { return col.name === value.name; });
                            if (column) {
                                Object.assign(column, value);
                            }
                            if (!column) {
                                _this._columns.push(value);
                            }
                        });
                    },
                    enumerable: true,
                    configurable: true
                });
                NgTableComponent.prototype.getRowTooltip = function (row) {
                    var id = "R" + row.Id;
                    $('#' + id).tooltip({
                        delay: { show: 500, hide: 10 },
                        placement: 'top',
                        html: true,
                        template: "<div class=\"tooltip\" style=\"display:inline-block; text-align:left;\"><div class=\"tooltip-arrow\" style=\"display:inline-block\"></div>\n        <div class=\"tooltip-inner\" style=\"display:inline-block; max-width: 600px; text-align:left;color: #FFFFFF; background-color: #647299;\"></div></div>",
                        title: (row && row.TooltipMessage) ? row.TooltipMessage : ""
                    });
                    return id;
                };
                NgTableComponent.prototype.getColumnClass = function (column) {
                    return "col-xs-" + column.colWidth;
                };
                NgTableComponent.prototype.onEditClick = function (event, row, column) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.editClicked.emit(row);
                };
                NgTableComponent.prototype.onDeleteClick = function (event, row, column) {
                    var _this = this;
                    event.preventDefault();
                    event.stopPropagation();
                    var msg = "Do you really want to delete this item?";
                    if (column.deleteMessage)
                        msg = column.deleteMessage;
                    var box = this.modal.confirm().isBlocking(true).size('sm').message(msg).open();
                    box.then(function (resultPromise) {
                        return resultPromise.result.then(function (result) {
                            _this.deleteClicked.emit(row);
                        });
                    });
                };
                Object.defineProperty(NgTableComponent.prototype, "configColumns", {
                    get: function () {
                        var sortColumns = [];
                        this.columns.forEach(function (column) {
                            if (column.sort) {
                                sortColumns.push(column);
                            }
                        });
                        return { columns: sortColumns };
                    },
                    enumerable: true,
                    configurable: true
                });
                NgTableComponent.prototype.onChangeTable = function (column) {
                    this._columns.forEach(function (col) {
                        if (col.name !== column.name && col.sort !== false) {
                            col.sort = '';
                        }
                    });
                    this.tableChanged.emit({ sorting: this.configColumns });
                };
                NgTableComponent.prototype.getData = function (row, propertyName) {
                    var val = propertyName.split('.').reduce(function (prev, curr) { return prev[curr]; }, row);
                    var colDef = this._columns.find(function (c) { return c.name == propertyName; });
                    if (colDef && colDef.transform) {
                        val = colDef.transform(val);
                    }
                    return val;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], NgTableComponent.prototype, "rows", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], NgTableComponent.prototype, "config", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], NgTableComponent.prototype, "rowTemplate", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], NgTableComponent.prototype, "tableChanged", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], NgTableComponent.prototype, "deleteClicked", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], NgTableComponent.prototype, "editClicked", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array), 
                    __metadata('design:paramtypes', [Array])
                ], NgTableComponent.prototype, "columns", null);
                NgTableComponent = __decorate([
                    core_1.Component({
                        selector: 'ng-table',
                        template: "\n    <table class=\"table table-striped table-bordered table-hover dataTable\"\n           role=\"grid\" style=\"width: 100%;\">\n      <thead>\n      <tr role=\"row\">\n        <th *ngFor=\"let column of columns\" data-html=\"true\" [class]=\"getColumnClass(column)\" [ngTableSorting]=\"config\" [column]=\"column\" (sortChanged)=\"onChangeTable($event)\">\n          {{column.title}}\n          <i *ngIf=\"config && column.sort\" class=\"pull-right fa\"\n            [ngClass]=\"{'fa-chevron-down': column.sort === 'desc', 'fa-chevron-up': column.sort === 'asc'}\"></i>\n        </th>\n      </tr>\n      </thead>\n      <tbody>      \n      <tr [attr.id]=\"getRowTooltip(row)\" *ngFor=\"let row of rows\">\n        <td *ngFor=\"let column of columns\">\n          <span style=\"display:inline-block; width:100%\" *ngIf=\"!column.deleteRow && !column.editRow\">{{getData(row, column.name)}}</span>\n          <span style=\"display:inline-block; width:100%\" *ngIf=\"column.editRow\" (click)=\"onEditClick($event, row, column)\"><i class=\"fa fa-edit\"></i></span>\n          <span style=\"display:inline-block; width:100%\" *ngIf=\"column.deleteRow\" (click)=\"onDeleteClick($event, row, column)\"><i class=\"fa fa-remove\"></i></span>          \n        </td>\n      </tr>\n      </tbody>\n    </table>\n",
                        styles: ['.table-hover tbody tr:hover td, .table-hover tbody tr:hover th { color: #FFFFFF; background-color: #647299;}'],
                        directives: [ng_table_sorting_directive_1.NgTableSortingDirective, common_1.NgClass, common_1.CORE_DIRECTIVES],
                        viewProviders: index_1.BS_MODAL_PROVIDERS.slice()
                    }), 
                    __metadata('design:paramtypes', [index_1.Modal, core_1.ViewContainerRef])
                ], NgTableComponent);
                return NgTableComponent;
            }());
            exports_1("NgTableComponent", NgTableComponent);
        }
    }
});
//# sourceMappingURL=ng-table.component.js.map