System.register(['../service/core-services.service', './base.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var core_services_service_1, base_component_1;
    var XCoreListComponent;
    return {
        setters:[
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (base_component_1_1) {
                base_component_1 = base_component_1_1;
            }],
        execute: function() {
            XCoreListComponent = (function (_super) {
                __extends(XCoreListComponent, _super);
                function XCoreListComponent(xCoreServices, hubService) {
                    var _this = this;
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.hubService = hubService;
                    this.serviceSubscription = null;
                    this.dataViewModel = { RowCount: 0, Rows: [] };
                    this.columns = [];
                    this.tableConfig = {
                        sorting: { columns: [] }
                    };
                    this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("XCoreListComponent");
                    //Unsubscribe from the infinite stream when when change routes
                    this.xCoreServices.Router.changes.subscribe(function (val) {
                        if (_this.serviceSubscription) {
                            _this.serviceSubscription.unsubscribe();
                            _this.serviceSubscription = null;
                        }
                    });
                }
                XCoreListComponent.prototype.initializeWith = function (columns, filterService, dataService) {
                    this.columns = columns;
                    this.tableConfig = { sorting: { columns: columns } };
                    this.filterService = filterService;
                    this.dataService = dataService;
                };
                XCoreListComponent.prototype.performStartup = function (currentViewModel, tableComponent, tableConfig, filterService, service) {
                    var _this = this;
                    var trace = this.classTrace("performStartup");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    filterService.initializeFilter().subscribe(function (filter) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        currentViewModel.Rows = [];
                        _this.loadFirstData(currentViewModel, tableComponent, tableConfig, filter, service);
                        _this.subscribeToFilterChanged(currentViewModel, tableComponent, tableConfig, filterService, service);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                XCoreListComponent.prototype.subscribeToFilterChanged = function (currentViewModel, tableComponent, tableConfig, filterService, service) {
                    var _this = this;
                    var trace = this.classTrace("subscribeToFilterChanged");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    filterService.FilterUpdatedEvent.subscribe(function (filter) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        currentViewModel.Rows = [];
                        _this.loadFirstData(currentViewModel, tableComponent, tableConfig, filter, service);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                XCoreListComponent.prototype.loadFirstData = function (currentViewModel, tableComponent, tableConfig, filter, service) {
                    var _this = this;
                    var trace = this.classTrace("loadFirstData");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    currentViewModel.Rows = currentViewModel.Rows.concat(filter.toClientFilter.Rows);
                    currentViewModel.RowCount = filter.toClientFilter.RowCount;
                    var msg = { rows: currentViewModel.Rows, config: tableConfig };
                    tableComponent.load(msg);
                    //Subscribe to infinite scroll
                    if (this.serviceSubscription)
                        this.serviceSubscription.unsubscribe();
                    this.serviceSubscription = this.xCoreServices.ScrollService.ScrollNearBottomEvent.subscribe(function (si) {
                        if (currentViewModel.Rows.length >= currentViewModel.RowCount)
                            return;
                        service.get(currentViewModel.Rows.length, _this.xCoreServices.AppSettings.DefaultPageSize, filter.toServerFilter).subscribe(function (data) {
                            currentViewModel.Rows = currentViewModel.Rows.concat(data.Rows);
                            currentViewModel.RowCount = data.RowCount;
                            tableComponent.load({ rows: currentViewModel.Rows, config: tableConfig });
                            _this.xCoreServices.ScrollService.checkNearBottom();
                        });
                    });
                    this.xCoreServices.ScrollService.checkNearBottom();
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                XCoreListComponent.prototype.initialize = function (tableComponent) {
                    var trace = this.classTrace("initializing");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.tableComponent = tableComponent;
                    this.hubService.callbackWhenLoaded(this.performStartup.bind(this, this.dataViewModel, this.tableComponent, this.tableConfig, this.filterService, this.dataService));
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                return XCoreListComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("XCoreListComponent", XCoreListComponent);
        }
    }
});
//# sourceMappingURL=list.component.js.map