System.register(['../xcore-toasty/xcore-toasty.service', '@angular/core'], function(exports_1, context_1) {
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
    var xcore_toasty_service_1, core_1;
    var LoggingService;
    return {
        setters:[
            function (xcore_toasty_service_1_1) {
                xcore_toasty_service_1 = xcore_toasty_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            LoggingService = (function () {
                function LoggingService(_xCoreToast) {
                    this._xCoreToast = _xCoreToast;
                }
                LoggingService.prototype.error = function (message, options) {
                    var toastOptions = this.setToastOptions(message, options);
                    this._xCoreToast.error(toastOptions);
                };
                LoggingService.prototype.success = function (message, options) {
                    var toastOptions = this.setToastOptions(message, options);
                    this._xCoreToast.success(toastOptions);
                };
                LoggingService.prototype.default = function (message, options) {
                    var toastOptions = this.setToastOptions(message, options);
                    this._xCoreToast.default(toastOptions);
                };
                LoggingService.prototype.info = function (message, options) {
                    var toastOptions = this.setToastOptions(message, options);
                    this._xCoreToast.info(toastOptions);
                };
                LoggingService.prototype.warn = function (message, options) {
                    var toastOptions = this.setToastOptions(message, options);
                    this._xCoreToast.warn(toastOptions);
                };
                LoggingService.prototype.wait = function (message, options) {
                    var toastOptions = this.setToastOptions(message, options);
                    this._xCoreToast.wait(toastOptions);
                };
                LoggingService.prototype.setToastOptions = function (message, options) {
                    var toastOptions = { message: message };
                    if (options) {
                        toastOptions.showClose = options.showClose || '';
                        toastOptions.timeout = options.timeout || '';
                        toastOptions.title = options.title || '';
                    }
                    return toastOptions;
                };
                LoggingService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [xcore_toasty_service_1.XCoreToastService])
                ], LoggingService);
                return LoggingService;
            }());
            exports_1("LoggingService", LoggingService);
        }
    }
});
//# sourceMappingURL=logging.service.js.map