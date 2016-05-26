System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var AppSettings;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AppSettings = (function () {
                function AppSettings() {
                }
                Object.defineProperty(AppSettings.prototype, "IdentityServerEndpoint", {
                    get: function () { return 'https://www.localidentity.com:10000'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "ApiRedirectOnLogin", {
                    //public get IdentityServerEndpoint(): string { return 'http://localhost:5000'};   
                    get: function () { return window.location.protocol + "//" + window.location.host; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "ApiRedirectOnLogout", {
                    get: function () { return window.location.protocol + "//" + window.location.host; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "HubApiEndpoint", {
                    get: function () { return 'http://localhost:5000/api'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "HubController", {
                    get: function () { return 'Hub'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "ApiClientId", {
                    get: function () { return 'xclaim.web.api'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "HubScopes", {
                    get: function () { return 'openid profile xclaim.hub'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "ResponseType", {
                    get: function () { return 'id_token token'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "LoginRoute", {
                    get: function () { return '/Login'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "LogoutRoute", {
                    get: function () { return '/Logout'; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(AppSettings.prototype, "CookieKeys", {
                    get: function () {
                        return {
                            RouteAfterLoginKey: 'xc.routeAfterLogin'
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                AppSettings = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], AppSettings);
                return AppSettings;
            }());
            exports_1("AppSettings", AppSettings);
        }
    }
});
//# sourceMappingURL=appsettings.js.map