System.register(['@angular/core', '@angular/common', './table.sorting.directive', 'angular2-modal/plugins/bootstrap/index'], function(exports_1, context_1) {
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
    var core_1, common_1, table_sorting_directive_1, index_1;
    var NgTableComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (table_sorting_directive_1_1) {
                table_sorting_directive_1 = table_sorting_directive_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }],
        execute: function() {
            NgTableComponent = (function () {
                function NgTableComponent(modal, viewContainer) {
                    this.modal = modal;
                    this._columns = [];
                    // Table values
                    this.rows = [];
                    this.config = { sorting: { columns: [] } };
                    this.rowTemplate = "";
                    this.tooltipTemplate = "<div class=\"tooltip tooltip-custom\">\n                  <div class=\"tooltip-arrow tooltip-arrow-custom\"></div>\n                  <div class=\"tooltip-inner tooltip-inner-custom\"></div>\n                </div>";
                    // Outputs (Events)
                    this.tableChanged = new core_1.EventEmitter();
                    this.deleteClicked = new core_1.EventEmitter();
                    this.editClicked = new core_1.EventEmitter();
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
                    if (!this.tooltipTemplate)
                        return id;
                    $('#' + id).tooltip({
                        delay: { show: 500, hide: 10 },
                        placement: 'top',
                        html: true,
                        template: this.tooltipTemplate,
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
                NgTableComponent.prototype.changeSortEvent = function () {
                    this.rows = this.changeSort(this.rows, this.config);
                };
                NgTableComponent.prototype.changeTableEvent = function (tableChangedMessage) {
                    this.rows = this.changeSort(tableChangedMessage.rows, tableChangedMessage.config);
                };
                NgTableComponent.prototype.getData = function (row, propertyName) {
                    var val = propertyName.split('.').reduce(function (prev, curr) { return prev[curr]; }, row);
                    var colDef = this._columns.find(function (c) { return c.name == propertyName; });
                    if (colDef && colDef.transform) {
                        val = colDef.transform(val);
                    }
                    return val;
                };
                NgTableComponent.prototype.getSortedColumn = function (config) {
                    var columns = config.sorting.columns || [];
                    var columnName = void 0;
                    var sort = void 0;
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i].sort) {
                            columnName = columns[i].name;
                            sort = columns[i].sort;
                        }
                    }
                    return { columnName: columnName, sort: sort };
                };
                NgTableComponent.prototype.changeSort = function (data, config) {
                    if (!config.sorting)
                        return data;
                    var sortedColumn = this.getSortedColumn(config);
                    if (!sortedColumn.columnName)
                        return data;
                    // simple sorting
                    var sorted = data.sort(function (previous, current) {
                        var prev = previous[sortedColumn.columnName];
                        var curr = current[sortedColumn.columnName];
                        if (prev === null)
                            prev = "";
                        if (curr === null)
                            curr = "";
                        if (typeof curr === 'string')
                            curr = curr.toLowerCase();
                        if (typeof prev === 'string')
                            prev = prev.toLowerCase();
                        var ret = 0;
                        if (prev > curr) {
                            ret = sortedColumn.sort === 'desc' ? -1 : 1;
                        }
                        else if (prev < curr) {
                            ret = sortedColumn.sort === 'asc' ? -1 : 1;
                        }
                        return ret;
                    });
                    return sorted;
                };
                NgTableComponent.prototype.ngAfterContentInit = function () {
                    var _this = this;
                    this.tableChangedEvent.asObservable().subscribe(function (msg) {
                        _this.changeTableEvent(msg);
                    });
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
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], NgTableComponent.prototype, "tooltipTemplate", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], NgTableComponent.prototype, "tableChangedEvent", void 0);
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
                        styleUrls: ['app/shared/table/table.component.css'],
                        templateUrl: 'app/shared/table/table.component.html',
                        directives: [table_sorting_directive_1.NgTableSortingDirective, common_1.NgClass, common_1.CORE_DIRECTIVES],
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
//# sourceMappingURL=table.component.js.map