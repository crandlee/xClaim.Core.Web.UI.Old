System.register(['@angular/core', '../service/core-services.service', 'lodash', './filter.service', '../component/base.component', 'ng2-bootstrap/ng2-bootstrap'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, core_services_service_1, lodash_1, filter_service_1, base_component_1, ng2_bootstrap_1;
    var FilterComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (filter_service_1_1) {
                filter_service_1 = filter_service_1_1;
            },
            function (base_component_1_1) {
                base_component_1 = base_component_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            }],
        execute: function() {
            FilterComponent = (function (_super) {
                __extends(FilterComponent, _super);
                function FilterComponent(xCoreServices, filterService) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.filterService = filterService;
                    this.mergedServiceOptions = false;
                    this.filterVisible = false;
                    this.summaryText = "No filter set";
                    this.initializeTrace("FilterComponent");
                    var trace = this.classTrace("constructor");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.watchForServiceSetupCalled();
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                }
                Object.defineProperty(FilterComponent.prototype, "toServerFilter", {
                    get: function () { return this.filterService.currentFilter.toServerFilter; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FilterComponent.prototype, "componentOptions", {
                    get: function () { return this.filterService.componentOptions; },
                    set: function (componentOptions) { this.filterService.componentOptions = lodash_1.default.merge(this.filterService.componentOptions, componentOptions); },
                    enumerable: true,
                    configurable: true
                });
                FilterComponent.prototype.fillWorkingArea = function () {
                    var _this = this;
                    //Currently Fills out Id variables for selected Id lists passed in the toServerFilter
                    //Uses the idListMappings on the FilterService to determine which dataArray goes to a particular idArray
                    this.workingArea = {};
                    this.filterService.idListMappings.forEach(function (mapping) {
                        if (_this.filterService.currentFilter.toServerFilter[mapping.idArrayName]) {
                            _this.filterService.currentFilter.toServerFilter[mapping.idArrayName].forEach(function (dataId) {
                                _this.workingArea[mapping.dataArrayName + dataId] = true;
                            });
                        }
                    });
                };
                //Once filter service has been configured, execute functionality that relies on that
                FilterComponent.prototype.watchForServiceSetupCalled = function () {
                    var _this = this;
                    var trace = this.classTrace("watchForServiceSetupCalled");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.unregisterSetupCalled = this.filterService.SetupCalledEvent.subscribe(function (called) {
                        _this.filterService.initializeFilter().subscribe(function (returnFilter) {
                            _this.unregisterSetupCalled.unsubscribe();
                            _this.unregisterSetupCalled = null;
                            _this.fillWorkingArea();
                            //Keep copy of initial summary text so we can make immediate text change on Reset (since we don't have to wait
                            //for the server to come back to know what it's going to be).
                            _this.summaryText = _this.filterService.getFilterSummary();
                        });
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                //Fire this when toServerFilter changes (ngModelChange)="toServerFilterChanged($event)" 
                FilterComponent.prototype.toServerFilterChanged = function (event) {
                    if (this.filterService.componentOptions && this.filterService.componentOptions.autoApplyFilter) {
                        this.applyFilter(event);
                    }
                };
                FilterComponent.prototype.updateFilter = function (filterFunction, timer) {
                    var _this = this;
                    var trace = this.classTrace("updateFilter");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.summaryText = this.filterService.getFilterSummary();
                    var obs = filterFunction.bind(this.filterService)();
                    if (timer > 0)
                        obs = obs.debounceTime(timer).map(function (i) { return i; });
                    else
                        obs = obs.map(function (i) { return i; });
                    obs.subscribe(function (filter) {
                        _this.fillWorkingArea();
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                FilterComponent.prototype.applyFilter = function (event) {
                    var trace = this.classTrace("applyFilter");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    var timeout = 0;
                    if (this.filterService.componentOptions.autoApplyFilter) {
                        timeout = (this.filterService.componentOptions && this.filterService.componentOptions.applyDelayOnAutoFilter) || 2000;
                    }
                    else {
                        this.filterVisible = false;
                    }
                    var obs = this.updateFilter(this.filterService.applyFilter, timeout);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                FilterComponent.prototype.resetFilter = function (event) {
                    var _this = this;
                    var trace = this.classTrace("resetFilter");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    this.filterVisible = false;
                    var obs = this.updateFilter(this.filterService.resetFilter, 0);
                    obs.subscribe(function () {
                        _this.summaryText = _this.filterService.getFilterSummary();
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                FilterComponent.prototype.setIdList = function (idType, id) {
                    var trace = this.classTrace("setIdList");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var mapping = this.filterService.idListMappings.filter(function (item) { return item.dataArrayName === idType; });
                    if (!mapping || mapping.length === 0)
                        return;
                    if (this.workingArea[idType + id]) {
                        this.filterService.currentFilter.toServerFilter[mapping[0].idArrayName].push(id);
                    }
                    else {
                        var index = this.filterService.currentFilter.toServerFilter[mapping[0].idArrayName].indexOf(id);
                        if (index > -1)
                            this.filterService.currentFilter.toServerFilter[mapping[0].idArrayName].splice(index, 1);
                    }
                    this.toServerFilterChanged();
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                //*****Some helper functions for building filter summary descriptions******
                FilterComponent.aggregateDescription = function (items, nameProperty, header, anded) {
                    var aggregate = "";
                    if (items.length > 0) {
                        items.forEach(function (item) { aggregate += (aggregate === "" ? "" : " OR ") + item[nameProperty]; });
                        return anded + header + "(" + aggregate + ")";
                    }
                    return "";
                };
                FilterComponent.selectedItems = function (arrList, idList, idProperty) {
                    idProperty = idProperty || "Id";
                    return (arrList && arrList.filter(function (item) { return item && idList && (idList.indexOf(item[idProperty]) > -1); })) || [];
                };
                FilterComponent.addAnd = function (summary) {
                    return (summary === "") ? "" : " AND ";
                };
                FilterComponent = __decorate([
                    core_1.Component({
                        styleUrls: ['app/shared/filtering/filter.component.css'],
                        templateUrl: 'app/shared/filtering/filter.component.html',
                        providers: [filter_service_1.FilterService],
                        directives: [ng2_bootstrap_1.ACCORDION_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, filter_service_1.FilterService])
                ], FilterComponent);
                return FilterComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("FilterComponent", FilterComponent);
        }
    }
});
//# sourceMappingURL=filter.component.js.map