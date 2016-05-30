System.register(['@angular/core', '../service/core-services.service', '../component/base.component'], function(exports_1, context_1) {
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
    var core_1, core_services_service_1, base_component_1;
    var LogoutComponent;
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
            LogoutComponent = (function (_super) {
                __extends(LogoutComponent, _super);
                function LogoutComponent(xCoreServices) {
                    _super.call(this, xCoreServices);
                    this.xCoreServices = xCoreServices;
                }
                LogoutComponent.prototype.ngOnInit = function () {
                    this.xCoreServices.SecurityService.Logoff();
                };
                LogoutComponent = __decorate([
                    core_1.Component({
                        template: '<div></div>',
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [core_services_service_1.XCoreServices])
                ], LogoutComponent);
                return LogoutComponent;
            }(base_component_1.XCoreBaseComponent));
            exports_1("LogoutComponent", LogoutComponent);
        }
    }
});
//# sourceMappingURL=logout.component.js.map