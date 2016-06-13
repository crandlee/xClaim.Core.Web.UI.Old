System.register(['@angular/core', '@angular/common', '../shared/service/core-services.service', '../usermanagement/user.service', '../shared/component/base.component', '../shared/hub/hub.service', 'lodash', './claimDefinitions.service', '../shared/table/table.component', '../shared/pipe/orderby.pipe'], function(exports_1, context_1) {
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
    var core_1, common_1, core_services_service_1, user_service_1, base_component_1, hub_service_1, lodash_1, claimDefinitions_service_1, table_component_1, orderby_pipe_1;
    var UserClaimsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (user_service_1_1) {
                user_service_1 = user_service_1_1;
            },
            function (base_component_1_1) {
                base_component_1 = base_component_1_1;
            },
            function (hub_service_1_1) {
                hub_service_1 = hub_service_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (claimDefinitions_service_1_1) {
                claimDefinitions_service_1 = claimDefinitions_service_1_1;
            },
            function (table_component_1_1) {
                table_component_1 = table_component_1_1;
            },
            function (orderby_pipe_1_1) {
                orderby_pipe_1 = orderby_pipe_1_1;
            }],
        execute: function() {
            UserClaimsComponent = (function (_super) {
                __extends(UserClaimsComponent, _super);
                function UserClaimsComponent(xCoreServices, userService, builder, hubService, claimDefinitionsService) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.userService = userService;
                    this.builder = builder;
                    this.hubService = hubService;
                    this.claimDefinitionsService = claimDefinitionsService;
                    this.columns = [
                        { name: "Description", title: "Claim Name", colWidth: 5, sort: "asc" },
                        { name: "Value", title: "Claim Value", colWidth: 6 },
                        { name: "Delete", title: "", deleteRow: true, deleteMessage: "Delete this claim from the user?", colWidth: 1 }
                    ];
                    this.tableConfig = {
                        sorting: { columns: this.columns }
                    };
                    this.claimDefinitions = [];
                    this.initializeTrace("UserClaimsComponent");
                }
                Object.defineProperty(UserClaimsComponent.prototype, "tableLoadFunction", {
                    get: function () {
                        var _this = this;
                        return function () {
                            return { rows: lodash_1.default.filter(_this.User.Claims, function (r) { return ['given_name', 'email', 'sub', 'name'].indexOf(r.Name) === -1; }), config: _this.tableConfig };
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                UserClaimsComponent.prototype.load = function (user) {
                    var _this = this;
                    this.User = user;
                    this.TableComponent.load(this.tableLoadFunction());
                    this.claimDefinitionsService.getNonCoreDefinitions().subscribe(function (cd) {
                        _this.claimDefinitions = cd.Rows;
                    });
                };
                UserClaimsComponent.prototype.deleteClaim = function (row) {
                    var _this = this;
                    var trace = this.classTrace("deleteClaim");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.userService.deleteUserClaim(row.Id).subscribe(function (d) {
                        if (d) {
                            _this.xCoreServices.LoggingService.success("User claim " + row.Description + " deleted successfully");
                            lodash_1.default.remove(_this.User.Claims, function (cd) { return cd.Id === row.Id && cd.Value.toLowerCase() === row.Value.toLowerCase(); });
                            _this.TableComponent.load(_this.tableLoadFunction());
                        }
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                UserClaimsComponent.prototype.addClaim = function (event) {
                    var _this = this;
                    var trace = this.classTrace("addClaim");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var claimLookup = lodash_1.default.find(this.claimDefinitions, function (cd) { return cd.Id === _this.ClaimType; });
                    var existingUserClaim = lodash_1.default.find(this.User.Claims, function (cd) { return cd.DefinitionId === _this.ClaimType && cd.Value.toLowerCase() === _this.ClaimValue.toLowerCase(); });
                    if (existingUserClaim)
                        this.xCoreServices.LoggingService.warn("This claim/value already exist on the user");
                    if (claimLookup && !existingUserClaim) {
                        var vm = { Id: "", Value: this.ClaimValue, DefinitionId: claimLookup.Id, Description: claimLookup.Description, Name: claimLookup.Name, UserId: this.User.Id };
                        this.userService.saveUserClaim(vm).subscribe(function (vm) {
                            _this.xCoreServices.LoggingService.success("Successfully added new " + vm.Description + " claim ");
                            _this.User.Claims.push(vm);
                            _this.TableComponent.load(_this.tableLoadFunction());
                            _this.ClaimType = null;
                            _this.ClaimValue = null;
                        });
                    }
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], UserClaimsComponent.prototype, "User", void 0);
                __decorate([
                    core_1.ViewChild(table_component_1.NgTableComponent), 
                    __metadata('design:type', table_component_1.NgTableComponent)
                ], UserClaimsComponent.prototype, "TableComponent", void 0);
                UserClaimsComponent = __decorate([
                    core_1.Component({
                        selector: 'user-claims',
                        styleUrls: ['app/usermanagement/user.claims.component.css'],
                        templateUrl: 'app/usermanagement/user.claims.component.html',
                        providers: [user_service_1.UserService, claimDefinitions_service_1.ClaimDefinitionsService],
                        directives: [table_component_1.NgTableComponent],
                        pipes: [orderby_pipe_1.OrderByPipe]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, user_service_1.UserService, common_1.FormBuilder, hub_service_1.HubService, claimDefinitions_service_1.ClaimDefinitionsService])
                ], UserClaimsComponent);
                return UserClaimsComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("UserClaimsComponent", UserClaimsComponent);
        }
    }
});
//# sourceMappingURL=user.claims.component.js.map