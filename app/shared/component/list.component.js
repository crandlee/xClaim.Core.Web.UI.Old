System.register(['@angular/core', '../service/core-services.service', './base.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var core_1, core_services_service_1, base_component_1;
    var XCoreListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
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
                    this.dataViewModel = { RowCount: 0, Rows: [], Active: false };
                    this.columns = [];
                    this.tableChangeEmitter = new core_1.EventEmitter();
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
                };
                XCoreListComponent.prototype.performStartup = function (currentViewModel, tableChangeEmitter, tableConfig, filterService, service) {
                    var _this = this;
                    var trace = this.classTrace("performStartup");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    currentViewModel.Active = true;
                    filterService.initializeFilter().subscribe(function (filter) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        _this.loadFirstData(currentViewModel, tableChangeEmitter, tableConfig, filter, service);
                        _this.subscribeToFilterChanged(currentViewModel, tableChangeEmitter, tableConfig, filterService, service);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                XCoreListComponent.prototype.subscribeToFilterChanged = function (currentViewModel, tableChangeEmitter, tableConfig, filterService, service) {
                    var _this = this;
                    var trace = this.classTrace("subscribeToFilterChanged");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    filterService.FilterUpdatedEvent.subscribe(function (filter) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        _this.loadFirstData(currentViewModel, tableChangeEmitter, tableConfig, filter, service);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                XCoreListComponent.prototype.loadFirstData = function (currentViewModel, tableChangeEmitter, tableConfig, filter, service) {
                    var _this = this;
                    var trace = this.classTrace("loadFirstData");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var returnData = [];
                    currentViewModel.Rows = currentViewModel.Rows.concat(filter.toClientFilter.Rows);
                    currentViewModel.RowCount = filter.toClientFilter.RowCount;
                    var msg = { rows: currentViewModel.Rows, config: tableConfig };
                    tableChangeEmitter.emit(msg);
                    //Subscribe to infinite scroll
                    if (this.serviceSubscription)
                        this.serviceSubscription.unsubscribe();
                    this.serviceSubscription = this.xCoreServices.ScrollService.ScrollNearBottomEvent.subscribe(function (si) {
                        if (returnData.length >= currentViewModel.RowCount)
                            return;
                        service.get(returnData.length, _this.xCoreServices.AppSettings.DefaultPageSize, filter.toServerFilter).subscribe(function (data) {
                            currentViewModel.Rows = currentViewModel.Rows.concat(data.Rows);
                            currentViewModel.RowCount = data.RowCount;
                            tableChangeEmitter.emit({ rows: currentViewModel.Rows, config: tableConfig });
                            _this.xCoreServices.ScrollService.checkNearBottom();
                        });
                    });
                    this.xCoreServices.ScrollService.checkNearBottom();
                    trace(core_services_service_1.TraceMethodPosition.CallbackEnd);
                };
                XCoreListComponent.prototype.ngOnInit = function () {
                    var trace = this.classTrace("ngOnInit");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.hubService.callbackWhenLoaded(this.performStartup.bind(this, this.tableChangeEmitter, this.tableConfig, this.dataViewModel, this.filterService, this.dataService));
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                return XCoreListComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("XCoreListComponent", XCoreListComponent);
        }
    }
});
//# sourceMappingURL=list.component.js.map