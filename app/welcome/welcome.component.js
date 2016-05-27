System.register(['@angular/core', '../shared/service/core-services.service', '../shared/hub/hub.service', 'ng2-bootstrap'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, hub_service_1, ng2_bootstrap_1;
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
            }],
        execute: function() {
            WelcomeComponent = (function () {
                function WelcomeComponent(xCoreServices, hubService) {
                    var _this = this;
                    this.xCoreServices = xCoreServices;
                    this.hubService = hubService;
                    this.oneAtATime = true;
                    this.items = ['Item 1', 'Item 2', 'Item 3'];
                    this.status = {
                        isFirstOpen: true,
                        isFirstDisabled: false
                    };
                    this.groups = [
                        {
                            title: 'Dynamic Group Header - 1',
                            content: 'Dynamic Group Body - 1'
                        },
                        {
                            title: 'Dynamic Group Header - 2',
                            content: 'Dynamic Group Body - 2'
                        }
                    ];
                    //Set up events
                    this.hubService.HubDataCompletedEvent.subscribe(function (hd) {
                        _this.hubData = hd;
                    });
                }
                WelcomeComponent.prototype.addItem = function () {
                    this.items.push("Items " + (this.items.length + 1));
                };
                WelcomeComponent.prototype.ngOnInit = function () {
                };
                WelcomeComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/welcome/welcome.component.html',
                        directives: [ng2_bootstrap_1.ACCORDION_DIRECTIVES],
                        providers: []
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