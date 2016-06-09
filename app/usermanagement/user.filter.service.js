System.register(['../shared/filtering/filter.service', '../shared/service/core-services.service', './userprofile.service', '@angular/core'], function(exports_1, context_1) {
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
    var filter_service_1, core_services_service_1, userprofile_service_1, core_1;
    var UserFilterService;
    return {
        setters:[
            function (filter_service_1_1) {
                filter_service_1 = filter_service_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (userprofile_service_1_1) {
                userprofile_service_1 = userprofile_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            UserFilterService = (function (_super) {
                __extends(UserFilterService, _super);
                function UserFilterService(xCoreServices, userProfileService) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.userProfileService = userProfileService;
                    this.initialComponentOptions = {
                        autoApplyFilter: false
                    };
                    this.idListMappings = [{ dataArrayName: "Status", idArrayName: "Statuses" }];
                    var trace = this.classTrace("constructor");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var setupObject = {
                        componentOptions: this.initialComponentOptions,
                        idListMappings: this.idListMappings,
                        filterSummaryFunction: this.filterSummaryFunction.bind(this),
                        initializeFilterFunction: this.initializeFilterFunction.bind(this),
                        filterResetFunction: this.filterResetFunction.bind(this),
                        applyFilterFunction: this.applyFilterFunction.bind(this)
                    };
                    this.setup(this.emptyFilterDefinition(), setupObject);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                }
                UserFilterService.prototype.emptyFilterDefinition = function () {
                    return {
                        toClientFilter: { Rows: [], RowCount: 0, Statuses: this.userProfileService.defaultStatuses },
                        toServerFilter: { UserName: null, Email: null, FullName: null, Status: "All" }
                    };
                };
                UserFilterService.prototype.filterSummaryFunction = function (filter) {
                    var trace = this.classTrace("filterSummaryFunction");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var toServerFilter = filter.toServerFilter;
                    var toClientFilter = filter.toClientFilter;
                    var filterSummary = "";
                    if (toServerFilter.UserName)
                        filterSummary += "User Name contains '" + (toServerFilter.UserName || "") + "'";
                    if (toServerFilter.FullName)
                        filterSummary += this.addAnd(filterSummary) + "Full Name contains '" + (toServerFilter.FullName || "") + "'";
                    if (toServerFilter.Email)
                        filterSummary += this.addAnd(filterSummary) + "Email contains '" + (toServerFilter.Email || "") + "'";
                    if (toServerFilter.Status && toServerFilter.Status !== "All")
                        filterSummary += this.addAnd(filterSummary) + "Status = " + (toServerFilter.Status || "") + "";
                    //filterSummary += this.aggregateDescription(this.selectedItems(toClientFilter.Status, toServerFilter.Statuses, "Value"), "Value", "Statuses are ", this.addAnd(filterSummary));
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return filterSummary;
                };
                UserFilterService.prototype.initializeFilterFunction = function () {
                    var trace = this.classTrace("initializeFilterFunction");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.userProfileService.getUsers(null, null, this.emptyFilterDefinition().toServerFilter);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserFilterService.prototype.filterResetFunction = function (filter) {
                    var _this = this;
                    var trace = this.classTrace("filterResetFunction");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.userProfileService.getUsers(null, null, this.emptyFilterDefinition().toServerFilter).map(function (cf) {
                        return { toClientFilter: cf, toServerFilter: _this.emptyFilterDefinition().toServerFilter };
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserFilterService.prototype.applyFilterFunction = function (filter) {
                    var _this = this;
                    var trace = this.classTrace("applyFilterfunction");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var obs = this.userProfileService.getUsers(null, null, filter).map(function (cf) {
                        return { toClientFilter: cf, toServerFilter: _this.currentFilter.toServerFilter };
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return obs;
                };
                UserFilterService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, userprofile_service_1.UserProfileService])
                ], UserFilterService);
                return UserFilterService;
            }(filter_service_1.FilterService));
            exports_1("UserFilterService", UserFilterService);
        }
    }
});
//# sourceMappingURL=user.filter.service.js.map