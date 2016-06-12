System.register(['@angular/core', '../shared/service/core-services.service', '../shared/component/list.component', '../shared/hub/hub.service', '../shared/table/table.component', 'lodash', './user.service', './user.filter.component', './user.filter.service'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, list_component_1, hub_service_1, table_component_1, lodash_1, user_service_1, user_filter_component_1, user_filter_service_1;
    var UserListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (list_component_1_1) {
                list_component_1 = list_component_1_1;
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
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (user_filter_component_1_1) {
                user_filter_component_1 = user_filter_component_1_1;
            },
            function (user_filter_service_1_1) {
                user_filter_service_1 = user_filter_service_1_1;
            }],
        execute: function() {
            UserListComponent = (function (_super) {
                __extends(UserListComponent, _super);
                function UserListComponent(xCoreServices, userService, userFilterService, hubService) {
                    _super.call(this, xCoreServices, hubService);
                    this.xCoreServices = xCoreServices;
                    this.userService = userService;
                    this.userFilterService = userFilterService;
                    this.hubService = hubService;
                    this.initializeTrace("UserListComponent");
                }
                UserListComponent.prototype.ngOnInit = function () {
                    this.dataViewModel.Active = true;
                    this.initializeWith([
                        { title: "User Name", name: "Name", colWidth: 3, sort: "asc" },
                        { title: "Full Name", name: "GivenName", colWidth: 6 },
                        { title: "Enabled", name: "Enabled", colWidth: 1, transform: function (val) { return val ? "Yes" : "No"; } },
                        { title: "Edit", name: "Edit", colWidth: 1, editRow: true },
                        { title: "Delete", name: "Delete", colWidth: 1, deleteRow: true, deleteMessage: 'Do you want to delete this user?' }
                    ], this.userFilterService, this.userService);
                };
                UserListComponent.prototype.ngAfterViewInit = function () {
                    this.NotifyLoaded("UserList");
                    _super.prototype.initialize.call(this, this.TableComponent);
                };
                UserListComponent.prototype.addNew = function (event) {
                    event.preventDefault();
                    var trace = this.classTrace("addNew");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.xCoreServices.Router.navigate(['/NewUser']);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserListComponent.prototype.editUser = function (row) {
                    var trace = this.classTrace("editUser");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (!row || !row.Id)
                        throw Error("Invalid row");
                    var url = "/User/" + row.Id;
                    this.xCoreServices.Router.navigate([url]);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserListComponent.prototype.deleteUser = function (row) {
                    var _this = this;
                    var trace = this.classTrace("deleteUser");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    if (!row || !row.Id)
                        throw Error("Invalid row");
                    this.userService.deleteUser(row.Id).subscribe(function (d) {
                        if (d) {
                            _this.xCoreServices.LoggingService.success("Used deleted successfully");
                            lodash_1.default.remove(_this.dataViewModel.Rows, function (u) { return u.Id === row.Id; });
                            _this.TableComponent.load({ rows: _this.dataViewModel.Rows, config: _this.tableConfig });
                        }
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                __decorate([
                    core_1.ViewChild(table_component_1.NgTableComponent), 
                    __metadata('design:type', table_component_1.NgTableComponent)
                ], UserListComponent.prototype, "TableComponent", void 0);
                UserListComponent = __decorate([
                    core_1.Component({
                        styleUrls: ['app/usermanagement/user.list.component.css'],
                        templateUrl: 'app/usermanagement/user.list.component.html',
                        providers: [user_service_1.UserService, user_filter_service_1.UserFilterService],
                        directives: [table_component_1.NgTableComponent, user_filter_component_1.UserFilterComponent]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, user_service_1.UserService, user_filter_service_1.UserFilterService, hub_service_1.HubService])
                ], UserListComponent);
                return UserListComponent;
            }(list_component_1.XCoreListComponent));
            exports_1("UserListComponent", UserListComponent);
        }
    }
});
//# sourceMappingURL=user.list.component.js.map