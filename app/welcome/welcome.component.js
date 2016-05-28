System.register(['@angular/core', '../shared/service/core-services.service', '../shared/hub/hub.service', 'ng2-bootstrap', 'lodash'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, core_services_service_1, hub_service_1, ng2_bootstrap_1, lodash_1;
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
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            }],
        execute: function() {
            WelcomeComponent = (function () {
                function WelcomeComponent(xCoreServices, hubService) {
                    var _this = this;
                    this.xCoreServices = xCoreServices;
                    this.hubService = hubService;
                    this.hubData = { ApiEndpoints: [], MenuItems: [], Scopes: "" };
                    this.menuItems = [];
                    this.menuItemIdGenerator = 0;
                    //Set up events
                    this.hubService.HubDataCompletedEvent.subscribe(function (hd) {
                        _this.hubData = hd;
                        _this.hubData.MenuItems = lodash_1.default.chain(_this.hubData.MenuItems)
                            .sortBy(function (mi) { return mi.Description; })
                            .value();
                        _this.menuItems = _this.flattenMenuItems();
                    });
                }
                ;
                WelcomeComponent.prototype.visibleMenuItems = function () {
                    return lodash_1.default.chain(this.menuItems).filter(function (mi) { return mi.IsDisplayed; }).value();
                };
                WelcomeComponent.prototype.navigateToRoute = function (route) {
                    if (!route)
                        return;
                    this.xCoreServices.Router.navigate([route]);
                };
                WelcomeComponent.prototype.flattenMenuItems = function () {
                    var ret = [];
                    var level = 1;
                    var parents = [];
                    this.menuItemIdGenerator = 0;
                    this.getMenuItemChildren(level, null, parents, this.hubData.MenuItems, ret);
                    return ret;
                };
                WelcomeComponent.prototype.getClassMap = function (menuItem) {
                    return "menu-image pull-left glyphicon " + menuItem.MenuItem.Icon;
                };
                WelcomeComponent.prototype.reactToItemClick = function (id) {
                    var item = lodash_1.default.find(this.menuItems, function (mi) { return mi.Id == id; });
                    if (!item)
                        this.xCoreServices.LoggingService.warn("Unable to select element with Id " + id);
                    if (item.MenuItem.SubMenus.length > 0) {
                        this.setMenuItemState(item, !item.IsOpen);
                    }
                    else {
                        this.navigateToRoute(item.MenuItem.Route);
                    }
                };
                WelcomeComponent.prototype.setMenuItemState = function (item, open) {
                    var _this = this;
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
                };
                WelcomeComponent.prototype.ngOnInit = function () {
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
            }());
            exports_1("WelcomeComponent", WelcomeComponent);
        }
    }
});
//# sourceMappingURL=welcome.component.js.map