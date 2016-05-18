System.register(['@angular/core', '../ng2-toasty/ng2-toasty'], function(exports_1, context_1) {
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
    var core_1, ng2_toasty_1;
    var XCoreToastService, XCoreToastType;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ng2_toasty_1_1) {
                ng2_toasty_1 = ng2_toasty_1_1;
            }],
        execute: function() {
            XCoreToastService = (function () {
                function XCoreToastService(_toastyService) {
                    this._toastyService = _toastyService;
                }
                XCoreToastService.prototype.default = function (options) {
                    this.callSpecificType(XCoreToastType.Default, this.getToastyOptions(options));
                };
                XCoreToastService.prototype.info = function (options) {
                    this.callSpecificType(XCoreToastType.Info, this.getToastyOptions(options));
                };
                XCoreToastService.prototype.wait = function (options) {
                    this.callSpecificType(XCoreToastType.Wait, this.getToastyOptions(options));
                };
                XCoreToastService.prototype.warn = function (options) {
                    this.callSpecificType(XCoreToastType.Warning, this.getToastyOptions(options));
                };
                XCoreToastService.prototype.error = function (options) {
                    this.callSpecificType(XCoreToastType.Error, this.getToastyOptions(options));
                };
                XCoreToastService.prototype.success = function (options) {
                    this.callSpecificType(XCoreToastType.Success, this.getToastyOptions(options));
                };
                XCoreToastService.prototype.callSpecificType = function (type, toastyOptions) {
                    switch (type) {
                        case XCoreToastType.Default:
                            this._toastyService.default(toastyOptions);
                            break;
                        case XCoreToastType.Info:
                            this._toastyService.info(toastyOptions);
                            break;
                        case XCoreToastType.Success:
                            this._toastyService.success(toastyOptions);
                            break;
                        case XCoreToastType.Wait:
                            this._toastyService.wait(toastyOptions);
                            break;
                        case XCoreToastType.Error:
                            this._toastyService.error(toastyOptions);
                            break;
                        case XCoreToastType.Warning:
                            this._toastyService.warning(toastyOptions);
                            break;
                    }
                };
                XCoreToastService.prototype.getToastyOptions = function (options) {
                    return {
                        msg: options.message || '',
                        title: options.title || '',
                        showClose: options.showClose || true,
                        timeout: options.timeout || 5000
                    };
                };
                XCoreToastService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [ng2_toasty_1.ToastyService])
                ], XCoreToastService);
                return XCoreToastService;
            }());
            exports_1("XCoreToastService", XCoreToastService);
            (function (XCoreToastType) {
                XCoreToastType[XCoreToastType["Default"] = 0] = "Default";
                XCoreToastType[XCoreToastType["Info"] = 1] = "Info";
                XCoreToastType[XCoreToastType["Success"] = 2] = "Success";
                XCoreToastType[XCoreToastType["Wait"] = 3] = "Wait";
                XCoreToastType[XCoreToastType["Error"] = 4] = "Error";
                XCoreToastType[XCoreToastType["Warning"] = 5] = "Warning";
            })(XCoreToastType || (XCoreToastType = {}));
            exports_1("XCoreToastType", XCoreToastType);
        }
    }
});
//# sourceMappingURL=xcore-toasty.service.js.map