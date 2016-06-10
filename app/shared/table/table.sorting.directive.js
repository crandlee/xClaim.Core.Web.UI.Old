System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var NgTableSortingDirective;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            NgTableSortingDirective = (function () {
                function NgTableSortingDirective() {
                    this.sortChanged = new core_1.EventEmitter();
                }
                Object.defineProperty(NgTableSortingDirective.prototype, "config", {
                    get: function () {
                        return this.ngTableSorting;
                    },
                    set: function (value) {
                        this.ngTableSorting = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                NgTableSortingDirective.clearOtherColumnSorts = function (config, column) {
                    config.sorting.columns = config.sorting.columns.map(function (c) {
                        if (c.name !== column.name)
                            c.sort = "";
                        return c;
                    });
                };
                NgTableSortingDirective.prototype.onToggleSort = function (event) {
                    if (event)
                        event.preventDefault();
                    NgTableSortingDirective.clearOtherColumnSorts(this.config, this.column);
                    if (this.column.editRow || this.column.deleteRow)
                        return;
                    if (this.ngTableSorting && this.column) {
                        switch (this.column.sort) {
                            case 'asc':
                                this.column.sort = 'desc';
                                break;
                            case 'desc':
                                this.column.sort = 'asc';
                                break;
                            default:
                                this.column.sort = 'asc';
                                break;
                        }
                        this.sortChanged.emit(this.column);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], NgTableSortingDirective.prototype, "ngTableSorting", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], NgTableSortingDirective.prototype, "column", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], NgTableSortingDirective.prototype, "sortChanged", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], NgTableSortingDirective.prototype, "config", null);
                __decorate([
                    core_1.HostListener('click', ['$event', '$target']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], NgTableSortingDirective.prototype, "onToggleSort", null);
                NgTableSortingDirective = __decorate([
                    core_1.Directive({ selector: '[ngTableSorting]' }), 
                    __metadata('design:paramtypes', [])
                ], NgTableSortingDirective);
                return NgTableSortingDirective;
            }());
            exports_1("NgTableSortingDirective", NgTableSortingDirective);
        }
    }
});
//# sourceMappingURL=table.sorting.directive.js.map