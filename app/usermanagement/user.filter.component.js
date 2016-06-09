System.register(['@angular/core', '../shared/filtering/filter.component', './user.filter.service', '../shared/service/core-services.service', 'ng2-bootstrap/ng2-bootstrap', '../shared/off-click/off-click.directive'], function(exports_1, context_1) {
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
    var core_1, filter_component_1, user_filter_service_1, core_services_service_1, ng2_bootstrap_1, off_click_directive_1;
    var UserFilterComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (filter_component_1_1) {
                filter_component_1 = filter_component_1_1;
            },
            function (user_filter_service_1_1) {
                user_filter_service_1 = user_filter_service_1_1;
            },
            function (core_services_service_1_1) {
                core_services_service_1 = core_services_service_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (off_click_directive_1_1) {
                off_click_directive_1 = off_click_directive_1_1;
            }],
        execute: function() {
            UserFilterComponent = (function (_super) {
                __extends(UserFilterComponent, _super);
                function UserFilterComponent(xCoreServices, userFilterService, renderer) {
                    _super.call(this, xCoreServices, userFilterService);
                    this.xCoreServices = xCoreServices;
                    this.userFilterService = userFilterService;
                    this.renderer = renderer;
                    this.self = this;
                }
                UserFilterComponent.prototype.ngOnInit = function () {
                };
                __decorate([
                    core_1.ViewChild('userName'), 
                    __metadata('design:type', Object)
                ], UserFilterComponent.prototype, "focusRef", void 0);
                UserFilterComponent = __decorate([
                    core_1.Component({
                        selector: "userfilter",
                        styleUrls: ['app/usermanagement/user.filter.component.css'],
                        templateUrl: 'app/usermanagement/user.filter.component.html',
                        providers: [],
                        directives: [ng2_bootstrap_1.ACCORDION_DIRECTIVES, off_click_directive_1.OffClickDirective]
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices, user_filter_service_1.UserFilterService, core_1.Renderer])
                ], UserFilterComponent);
                return UserFilterComponent;
            }(filter_component_1.FilterComponent));
            exports_1("UserFilterComponent", UserFilterComponent);
        }
    }
});
//# sourceMappingURL=user.filter.component.js.map