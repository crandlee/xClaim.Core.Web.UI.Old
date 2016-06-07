System.register(['@angular/core', '../shared/service/core-services.service', '../usermanagement/userprofile.service', '../shared/component/base.component', '../shared/hub/hub.service', 'ng2-table/ng2-table', 'lodash'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, userprofile_service_1, base_component_1, hub_service_1, ng2_table_1, lodash_1;
    var UserManagementComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (userprofile_service_1_1) {
                userprofile_service_1 = userprofile_service_1_1;
            },
            function (base_component_1_1) {
                base_component_1 = base_component_1_1;
            },
            function (hub_service_1_1) {
                hub_service_1 = hub_service_1_1;
            },
            function (ng2_table_1_1) {
                ng2_table_1 = ng2_table_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            UserManagementComponent = (function (_super) {
                __extends(UserManagementComponent, _super);
                function UserManagementComponent(xCoreServices, userProfileService, hubService) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.userProfileService = userProfileService;
                    this.hubService = hubService;
                    this.active = false;
                    this.rows = [];
                    this.columns = [
                        { title: "Name", name: "Name", colWidth: 3 },
                        { title: "Full Name", name: "GivenName", colWidth: 3 },
                        { title: "EMail Address", name: "EmailAddress", colWidth: 3 },
                        { title: "Enabled", name: "Enabled", colWidth: 1, transform: function (val) { return val ? "Yes" : "No"; } },
                        { title: "Edit", name: "Edit", colWidth: 1, editRow: true },
                        { title: "Delete", name: "Delete", colWidth: 1, deleteRow: true, deleteMessage: 'Do you want to delete this user?' }
                    ];
                    this.page = 1;
                    this.itemsPerPage = 10;
                    this.maxSize = 5;
                    this.numPages = 1;
                    this.length = 0;
                    this.config = {
                        paging: false,
                        sorting: { columns: this.columns },
                        filtering: { filterString: '', columnName: 'Name' }
                    };
                    this.initializeTrace("UserManagementComponent");
                }
                UserManagementComponent.prototype.addNew = function (event) {
                    event.preventDefault();
                    var trace = this.classTrace("addNew");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.xCoreServices.Router.navigate(['/NewUser']);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserManagementComponent.prototype.getInitialData = function (userProfileService) {
                    var _this = this;
                    var trace = this.classTrace("getInitialData");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    userProfileService.getUsers().subscribe(function (up) {
                        trace(core_services_service_1.TraceMethodPosition.CallbackStart);
                        _this.users = lodash_1.default.map(up, function (u) { return _this.userProfileService.userProfileToViewModel(u); });
                        _this.length = _this.users.length;
                        _this.active = true;
                        _this.onChangeTable(_this.users, _this.config);
                        trace(core_services_service_1.TraceMethodPosition.CallbackEnd);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserManagementComponent.prototype.ngOnInit = function () {
                    _super.prototype.NotifyLoaded.call(this, "UserManagement");
                    var trace = this.classTrace("ngOnInit");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.hubService.callbackWhenLoaded(this.getInitialData.bind(this, this.userProfileService));
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                };
                UserManagementComponent.prototype.changeFilter = function (data, config) {
                    var _this = this;
                    if (!config.filtering) {
                        return data;
                    }
                    var filteredData = data.filter(function (item) {
                        if (!_this.config.filtering.filterString)
                            return true;
                        var testItem = item[config.filtering.columnName];
                        return item[config.filtering.columnName].indexOf(_this.config.filtering.filterString) > -1;
                    });
                    return filteredData;
                };
                // public changePage(page: any, data: Array<any>): Array<any> {
                //     var trace = this.classTrace("changePage");
                //     trace(TraceMethodPosition.Entry);
                //     let start = (page.page - 1) * page.itemsPerPage;
                //     let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
                //     var ret = data.slice(start, end);
                //     trace(TraceMethodPosition.Exit);
                //     return ret;
                // }
                UserManagementComponent.prototype.changeSort = function (data, config) {
                    var trace = this.classTrace("changeSort");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (!config.sorting) {
                        return data;
                    }
                    var columns = this.config.sorting.columns || [];
                    var columnName = void 0;
                    var sort = void 0;
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i].sort !== '') {
                            columnName = columns[i].name;
                            sort = columns[i].sort;
                        }
                    }
                    if (!columnName) {
                        return data;
                    }
                    // simple sorting
                    var ret = data.sort(function (previous, current) {
                        if (previous[columnName] > current[columnName]) {
                            return sort === 'desc' ? -1 : 1;
                        }
                        else if (previous[columnName] < current[columnName]) {
                            return sort === 'asc' ? -1 : 1;
                        }
                        return 0;
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return ret;
                };
                UserManagementComponent.prototype.editUser = function (row) {
                    var trace = this.classTrace("editUser");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (!row || !row.Id)
                        throw Error("Invalid row");
                    var url = "/User/" + row.Id;
                    this.xCoreServices.Router.navigate([url]);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserManagementComponent.prototype.deleteUser = function (row) {
                    var _this = this;
                    var trace = this.classTrace("deleteUser");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (!row || !row.Id)
                        throw Error("Invalid row");
                    this.userProfileService.deleteUser(row.Id).subscribe(function (d) {
                        if (d) {
                            _this.xCoreServices.LoggingService.success("Used deleted successfully");
                            lodash_1.default.remove(_this.users, function (u) { return u.Id === row.Id; });
                            _this.onChangeTable(_this.users, _this.config);
                        }
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserManagementComponent.prototype.onChangeTable = function (data, config, page) {
                    if (page === void 0) { page = { page: this.page, itemsPerPage: this.itemsPerPage }; }
                    var trace = this.classTrace("onChangeTable");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (config && config.filtering) {
                        Object.assign(this.config.filtering, config.filtering);
                    }
                    if (config && config.sorting) {
                        Object.assign(this.config.sorting, config.sorting);
                    }
                    var filteredData = this.changeFilter(data, this.config);
                    var sortedData = this.changeSort(filteredData, this.config);
                    this.rows = sortedData;
                    this.length = sortedData.length;
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserManagementComponent = __decorate([
                    core_1.Component({
                        styleUrls: ['app/usermanagement/usermanagement.component.css'],
                        templateUrl: 'app/usermanagement/usermanagement.component.html',
                        providers: [userprofile_service_1.UserProfileService],
                        directives: [ng2_table_1.NG_TABLE_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, userprofile_service_1.UserProfileService, hub_service_1.HubService])
                ], UserManagementComponent);
                return UserManagementComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("UserManagementComponent", UserManagementComponent);
        }
    }
});
//# sourceMappingURL=usermanagement.component.js.map