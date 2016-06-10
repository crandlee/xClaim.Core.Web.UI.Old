System.register(['@angular/core', '../shared/service/core-services.service', '../shared/component/base.component', '../shared/hub/hub.service', '../shared/table/table.component', 'lodash', './userprofile.service', './user.filter.component', './user.filter.service'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, base_component_1, hub_service_1, table_component_1, lodash_1, userprofile_service_1, user_filter_component_1, user_filter_service_1;
    var UserManagementComponent;
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
            },
            function (hub_service_1_1) {
                hub_service_1 = hub_service_1_1;
            },
            function (table_component_1_1) {
                table_component_1 = table_component_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (userprofile_service_1_1) {
                userprofile_service_1 = userprofile_service_1_1;
            },
            function (user_filter_component_1_1) {
                user_filter_component_1 = user_filter_component_1_1;
            },
            function (user_filter_service_1_1) {
                user_filter_service_1 = user_filter_service_1_1;
            }],
        execute: function() {
            UserManagementComponent = (function (_super) {
                __extends(UserManagementComponent, _super);
                function UserManagementComponent(xCoreServices, userProfileService, userFilterService, hubService) {
                    var _this = this;
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.userProfileService = userProfileService;
                    this.userFilterService = userFilterService;
                    this.hubService = hubService;
                    this.active = false;
                    this.totalRows = 0;
                    this.userServiceSubscription = null;
                    this.changeTable = new core_1.EventEmitter();
                    this.rows = [];
                    this.columns = [
                        { title: "User Name", name: "Name", colWidth: 3, sort: "asc" },
                        { title: "Full Name", name: "GivenName", colWidth: 6 },
                        { title: "Enabled", name: "Enabled", colWidth: 1, transform: function (val) { return val ? "Yes" : "No"; } },
                        { title: "Edit", name: "Edit", colWidth: 1, editRow: true },
                        { title: "Delete", name: "Delete", colWidth: 1, deleteRow: true, deleteMessage: 'Do you want to delete this user?' }
                    ];
                    this.config = {
                        sorting: { columns: this.columns }
                    };
                    this.initializeTrace("UserManagementComponent");
                    //Unsubscribe from the infinite stream when when change routes
                    this.xCoreServices.Router.changes.subscribe(function (val) {
                        if (_this.userServiceSubscription) {
                            _this.userServiceSubscription.unsubscribe();
                            _this.userServiceSubscription = null;
                        }
                    });
                }
                UserManagementComponent.prototype.addNew = function (event) {
                    event.preventDefault();
                    var trace = this.classTrace("addNew");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.xCoreServices.Router.navigate(['/NewUser']);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserManagementComponent.prototype.performStartup = function (userFilterService, userProfileService) {
                    var _this = this;
                    var trace = this.classTrace("performStartup");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.active = true;
                    userFilterService.initializeFilter().subscribe(function (filter) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        _this.loadFirstData(filter, userProfileService, userFilterService);
                        _this.subscribeToFilterChanged(userFilterService, userProfileService);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserManagementComponent.prototype.subscribeToFilterChanged = function (userFilterService, userProfileService) {
                    var _this = this;
                    var trace = this.classTrace("subscribeToFilterChanged");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    userFilterService.FilterUpdatedEvent.subscribe(function (filter) {
                        trace(core_services_service_1.TraceMethodPosition.Callback);
                        _this.loadFirstData(filter, userProfileService, userFilterService);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserManagementComponent.prototype.loadFirstData = function (filter, userProfileService, userFilterService) {
                    var _this = this;
                    var trace = this.classTrace("loadData");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.users = lodash_1.default.map(filter.toClientFilter.Rows, function (u) { return userProfileService.userProfileToViewModel(u); });
                    this.totalRows = filter.toClientFilter.RowCount;
                    this.changeTable.emit({ rows: this.users, config: this.config });
                    if (this.userServiceSubscription)
                        this.userServiceSubscription.unsubscribe();
                    this.userServiceSubscription = this.xCoreServices.ScrollService.ScrollNearBottomEvent.subscribe(function (si) {
                        if (_this.users.length >= _this.totalRows)
                            return;
                        userProfileService.getUsers(_this.users.length, _this.xCoreServices.AppSettings.DefaultPageSize, filter.toServerFilter).subscribe(function (up) {
                            _this.users = _this.users.concat(lodash_1.default.map(up.Rows, function (u) { return userProfileService.userProfileToViewModel(u); }));
                            _this.totalRows = up.RowCount;
                            _this.changeTable.emit({ rows: _this.users, config: _this.config });
                            _this.xCoreServices.ScrollService.checkNearBottom();
                        });
                    });
                    this.xCoreServices.ScrollService.checkNearBottom();
                    trace(core_services_service_1.TraceMethodPosition.CallbackEnd);
                };
                UserManagementComponent.prototype.ngOnInit = function () {
                    _super.prototype.NotifyLoaded.call(this, "UserManagement");
                    this.hubService.callbackWhenLoaded(this.performStartup.bind(this, this.userFilterService, this.userProfileService));
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
                            _this.changeTable.emit({ rows: _this.users, config: _this.config });
                        }
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserManagementComponent = __decorate([
                    core_1.Component({
                        styleUrls: ['app/usermanagement/usermanagement.component.css'],
                        templateUrl: 'app/usermanagement/usermanagement.component.html',
                        providers: [userprofile_service_1.UserProfileService, user_filter_service_1.UserFilterService],
                        directives: [table_component_1.NgTableComponent, user_filter_component_1.UserFilterComponent]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, userprofile_service_1.UserProfileService, user_filter_service_1.UserFilterService, hub_service_1.HubService])
                ], UserManagementComponent);
                return UserManagementComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("UserManagementComponent", UserManagementComponent);
        }
    }
});
//# sourceMappingURL=usermanagement.component.js.map