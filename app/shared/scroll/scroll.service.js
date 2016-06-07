System.register(['@angular/core', 'rxjs/Subject', '../../appsettings', '@angular/core/src/facade/async'], function(exports_1, context_1) {
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
    var core_1, Subject_1, appsettings_1, async_1;
    var ScrollService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (appsettings_1_1) {
                appsettings_1 = appsettings_1_1;
            },
            function (async_1_1) {
                async_1 = async_1_1;
            }],
        execute: function() {
            ScrollService = (function () {
                function ScrollService(appSettings) {
                    this.appSettings = appSettings;
                    this.ScrollNearBottomSource = new Subject_1.Subject();
                    this.nearBottom = false;
                    this.ScrollNearBottomEvent = this.ScrollNearBottomSource.asObservable().share();
                }
                Object.defineProperty(ScrollService.prototype, "isNearBottom", {
                    get: function () {
                        this.checkNearBottom();
                        return this.nearBottom;
                    },
                    enumerable: true,
                    configurable: true
                });
                ScrollService.prototype.checkNearBottom = function () {
                    var _this = this;
                    async_1.TimerWrapper.setTimeout(function () {
                        var scrollElem = $(window.document.body);
                        var height = $(window).height();
                        if ($(window).scrollTop() + height > $(window.document).height() - _this.appSettings.DefaultNearBottomPixels) {
                            _this.notifyNearBottom(height);
                        }
                        if (_this.nearBottom && $(window).scrollTop() + height <= $(window.document).height() - _this.appSettings.DefaultNearBottomPixels) {
                            _this.notifyAwayFromBottom();
                        }
                    }, 500);
                };
                ScrollService.prototype.notifyNearBottom = function (positionY) {
                    this.ScrollNearBottomSource.next({ positionY: positionY });
                    this.nearBottom = true;
                };
                ScrollService.prototype.notifyAwayFromBottom = function () {
                    this.nearBottom = false;
                };
                ScrollService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [appsettings_1.AppSettings])
                ], ScrollService);
                return ScrollService;
            }());
            exports_1("ScrollService", ScrollService);
        }
    }
});
//# sourceMappingURL=scroll.service.js.map