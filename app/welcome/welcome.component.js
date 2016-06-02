System.register(['@angular/core', '../shared/service/core-services.service', '../shared/hub/hub.service', 'ng2-bootstrap', '../shared/component/base.component', 'lodash'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, hub_service_1, ng2_bootstrap_1, base_component_1, lodash_1;
    var WelcomeComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (hub_service_1_1) {
                hub_service_1 = hub_service_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (base_component_1_1) {
                base_component_1 = base_component_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            WelcomeComponent = (function (_super) {
                __extends(WelcomeComponent, _super);
                function WelcomeComponent(xCoreServices, hubService) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                    this.hubService = hubService;
                    this.hubData = { ApiEndpoints: [], MenuItems: [], Scopes: "", UserId: "" };
                    this.menuItems = [];
                    this.menuItemIdGenerator = 0;
                    this.initializeTrace("WelcomeComponent");
                }
                WelcomeComponent.prototype.loadMenuItems = function (hd) {
                    var trace = this.classTrace("loadMenuItems");
                    trace(core_services_service_1.TraceMethodPosition.CallbackStart);
                    this.hubData = hd;
                    this.hubData.MenuItems = lodash_1.default.chain(this.hubData.MenuItems)
                        .sortBy(function (mi) { return mi.Description; })
                        .value();
                    this.menuItems = this.flattenMenuItems();
                    trace(core_services_service_1.TraceMethodPosition.CallbackEnd);
                };
                WelcomeComponent.prototype.visibleMenuItems = function () {
                    var trace = this.classTrace("visibleMenuItems");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var ret = lodash_1.default.chain(this.menuItems).filter(function (mi) { return mi.IsDisplayed; }).value();
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                WelcomeComponent.prototype.navigateToRoute = function (route) {
                    if (!route)
                        return;
                    var trace = this.classTrace("navigateToRoute");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    this.xCoreServices.Router.navigate([route]);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                WelcomeComponent.prototype.flattenMenuItems = function () {
                    var trace = this.classTrace("flattenMenuItems");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var ret = [];
                    var level = 1;
                    var parents = [];
                    this.menuItemIdGenerator = 0;
                    this.getMenuItemChildren(level, null, parents, this.hubData.MenuItems, ret);
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                    return ret;
                };
                WelcomeComponent.prototype.getClassMap = function (menuItem) {
                    return "menu-image pull-left glyphicon " + menuItem.MenuItem.Icon;
                };
                WelcomeComponent.prototype.reactToItemClick = function (id) {
                    var trace = this.classTrace("reactToItemClick");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    var item = lodash_1.default.find(this.menuItems, function (mi) { return mi.Id == id; });
                    if (!item)
                        this.xCoreServices.LoggingService.warn("Unable to select element with Id " + id);
                    if (item.MenuItem.SubMenus.length > 0) {
                        this.setMenuItemState(item, !item.IsOpen);
                    }
                    else {
                        this.navigateToRoute(item.MenuItem.Route);
                    }
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                WelcomeComponent.prototype.setMenuItemState = function (item, open) {
                    var _this = this;
                    var trace = this.classTrace("setMenuItemState");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    item.IsOpen = open;
                    lodash_1.default.each(this.menuItems, function (mi) {
                        //If an item has this item in the parent chain then check to see if its immediate parent is open
                        //If it is then display it.  If not then don't
                        if (lodash_1.default.findIndex(mi.Parents, function (p) { return p == item.Id; }) > -1) {
                            if (mi.Parent && mi.Parent.IsOpen)
                                mi.IsDisplayed = true;
                            if (mi.Parent && !mi.Parent.IsOpen)
                                mi.IsDisplayed = false;
                            if (!open)
                                mi.IsDisplayed = false;
                        }
                    });
                    if (open) {
                        //Set other items at this level to closed if they are open
                        lodash_1.default.chain(this.menuItems)
                            .filter(function (mi) { return mi.Id !== item.Id && mi.Level == item.Level; })
                            .each(function (mi) { if (mi.IsOpen)
                            _this.setMenuItemState(mi, false); }).value();
                    }
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                WelcomeComponent.prototype.hasSubItems = function (menuItem) {
                    return menuItem.MenuItem.SubMenus.length > 0;
                };
                WelcomeComponent.prototype.showDownCaret = function (menuItem) {
                    return menuItem.MenuItem.SubMenus.length > 0 && menuItem.IsOpen;
                };
                WelcomeComponent.prototype.showLeftCaret = function (menuItem) {
                    return menuItem.MenuItem.SubMenus.length > 0 && !menuItem.IsOpen;
                };
                WelcomeComponent.prototype.getMenuItemChildren = function (level, parent, parents, currentChildren, allItems) {
                    var _this = this;
                    var trace = this.classTrace("getMenuItemChildren");
                    trace(core_services_service_1.TraceMethodPosition.Entry);
                    lodash_1.default.each(currentChildren, function (mi) {
                        _this.menuItemIdGenerator += 1;
                        var newMenuItem = {
                            Id: _this.menuItemIdGenerator,
                            MenuItem: mi,
                            IsDisplayed: (level == 1),
                            Level: level,
                            Parents: [].concat(parents),
                            Parent: parent,
                            IsOpen: false
                        };
                        allItems.push(newMenuItem);
                        _this.getMenuItemChildren(level + 1, newMenuItem, parents.concat(newMenuItem.Id), mi.SubMenus, allItems);
                    });
                    trace(core_services_service_1.TraceMethodPosition.Exit);
                };
                WelcomeComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    _super.prototype.NotifyLoaded.call(this, "Welcome");
                    if (this.hubService.HubDataLoaded)
                        this.loadMenuItems(this.hubService.HubData);
                    else
                        this.hubService.HubDataCompletedEvent.subscribe(function (hd) {
                            _this.loadMenuItems(hd);
                        });
                };
                WelcomeComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/welcome/welcome.component.html',
                        directives: [ng2_bootstrap_1.ACCORDION_DIRECTIVES],
                        providers: [],
                        styleUrls: ['app/welcome/welcome.component.css']
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, hub_service_1.HubService])
                ], WelcomeComponent);
                return WelcomeComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("WelcomeComponent", WelcomeComponent);
        }
    }
});
//# sourceMappingURL=welcome.component.js.map