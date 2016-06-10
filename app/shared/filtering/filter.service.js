System.register(['@angular/core', '../service/core-services.service', 'rxjs/Subject'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, Subject_1;
    var FilterService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            }],
        execute: function() {
            FilterService = (function (_super) {
                __extends(FilterService, _super);
                function FilterService(xCoreServices) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.componentOptions = { autoApplyFilter: false, applyDelayOnAutoFilter: 2000, otherComponentOptions: {} };
                    this.setupCalled = false;
                    this.SetupCalledSource = new Subject_1.Subject();
                    this.SetupCalledEvent = this.SetupCalledSource.asObservable().share();
                    this.InitializeCalledSource = new Subject_1.Subject();
                    this.InitializeCalledEvent = this.InitializeCalledSource.asObservable().share();
                    this.FilterUpdatedSource = new Subject_1.Subject();
                    this.FilterUpdatedEvent = this.FilterUpdatedSource.asObservable().share();
                    this.initializeTrace("FilterService");
                    var trace = this.classTrace("constructor");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                }
                FilterService.prototype.initialize = function (context, emptyFilterDefinition, initialComponentOptions, idListMappings, initializeFilter, filterSummaryFunction, filterResetFunction, applyFilterFunction) {
                    var trace = this.classTrace("initializeSetup");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var setupObject = {
                        componentOptions: initialComponentOptions,
                        idListMappings: idListMappings,
                        filterSummaryFunction: filterSummaryFunction.bind(context),
                        initializeFilterFunction: initializeFilter.bind(context),
                        filterResetFunction: filterResetFunction.bind(context),
                        applyFilterFunction: applyFilterFunction.bind(context)
                    };
                    this.emptyFilterDefinition = emptyFilterDefinition;
                    this.setup(emptyFilterDefinition(), setupObject);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                //This gets called by the domain component with all the functions and config data necessary to do its job
                //filterDefinition => the current toServerFilter definition
                FilterService.prototype.setup = function (filterDefinition, setupObject) {
                    var trace = this.classTrace("setup");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.setupObject = setupObject;
                    this.currentFilter = filterDefinition;
                    this.componentOptions = setupObject.componentOptions;
                    this.idListMappings = setupObject.idListMappings || [];
                    this.SetupCalledSource.next(true);
                    this.setupCalled = true;
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                ;
                FilterService.prototype.initializeFilter = function () {
                    var _this = this;
                    var trace = this.classTrace("initializeFilter");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    //This should retrieve both the client and server filter and set them on the current filter
                    this.checkRequiredConfiguration();
                    var obs = this.setupObject.initializeFilterFunction().share().map(function (cf) {
                        return { toServerFilter: _this.currentFilter.toServerFilter, toClientFilter: cf };
                    });
                    if (!this.setupObject.initializeFilterFunction)
                        throw "No pre-display filter behavior was defined";
                    obs.subscribe(function (returnFilter) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        if (!returnFilter)
                            throw "Must return a valid filter object from initializeFilterFunction";
                        _this.currentFilter = returnFilter;
                        _this.InitializeCalledSource.next(returnFilter);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                ;
                FilterService.prototype.applyFilter = function () {
                    var _this = this;
                    var trace = this.classTrace("applyFilter");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    //This function only returns the client filter.
                    this.checkRequiredConfiguration();
                    if (!this.setupObject.applyFilterFunction)
                        throw "No apply filter behavior was defined";
                    if (!this.currentFilter || !this.currentFilter.toServerFilter)
                        throw "No filter available to send to server";
                    var obs = this.setupObject.applyFilterFunction(this.currentFilter.toServerFilter).share();
                    obs.subscribe(function (returnFilter) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        if (!returnFilter)
                            throw "Must return a valid filter object from applyFilterFunction";
                        _this.currentFilter = returnFilter;
                        _this.FilterUpdatedSource.next(returnFilter);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                ;
                FilterService.prototype.checkRequiredConfiguration = function () {
                    if (!this.setupObject)
                        throw "No filter setup has been configured";
                    if (!this.currentFilter)
                        throw "No filter definition has been provided";
                    return this;
                };
                FilterService.prototype.getFilterSummary = function () {
                    var trace = this.classTrace("getFilterSummary");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.checkRequiredConfiguration();
                    if (!this.setupObject.filterSummaryFunction)
                        throw "No filter summary behavior was defined";
                    var ret = this.setupObject.filterSummaryFunction(this.currentFilter) || "No filter set";
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return ret;
                };
                FilterService.prototype.resetFilter = function () {
                    var _this = this;
                    var trace = this.classTrace("resetFilter");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.checkRequiredConfiguration();
                    if (!this.setupObject.filterResetFunction)
                        throw "No filter reset behavior was defined";
                    var obs = this.setupObject.filterResetFunction(this.currentFilter.toServerFilter);
                    obs.subscribe(function (returnFilter) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        if (!returnFilter)
                            throw "Must return a valid filter object from resetFilterFunction";
                        _this.currentFilter = returnFilter;
                        _this.FilterUpdatedSource.next(returnFilter);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                //*****Some helper functions for building filter summary descriptions******
                FilterService.prototype.aggregateDescription = function (items, nameProperty, header, anded) {
                    var aggregate = "";
                    if (items.length > 0) {
                        items.forEach(function (item) { aggregate += (aggregate === "" ? "" : " OR ") + item[nameProperty]; });
                        return anded + header + "(" + aggregate + ")";
                    }
                    return "";
                };
                FilterService.prototype.selectedItems = function (arrList, idList, idProperty) {
                    idProperty = idProperty || "Id";
                    return (arrList && arrList.filter(function (item) { return item && idList && (idList.indexOf(item[idProperty]) > -1); })) || [];
                };
                FilterService.prototype.addAnd = function (summary) {
                    return (summary === "") ? "" : " AND ";
                };
                FilterService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices])
                ], FilterService);
                return FilterService;
            }(core_services_service_1.XCoreServiceBase));
            exports_1("FilterService", FilterService);
        }
    }
});
//# sourceMappingURL=filter.service.js.map