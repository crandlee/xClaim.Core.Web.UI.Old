// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty
System.register(['@angular/core', '@angular/common', '@angular/platform-browser/src/facade/lang', './toasty.config', './toasty.service', './toasty.component'], function(exports_1, context_1) {
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
    var core_1, common_1, lang_1, toasty_config_1, toasty_service_1, toasty_component_1;
    var Toasty;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (lang_1_1) {
                lang_1 = lang_1_1;
            },
            function (toasty_config_1_1) {
                toasty_config_1 = toasty_config_1_1;
            },
            function (toasty_service_1_1) {
                toasty_service_1 = toasty_service_1_1;
            },
            function (toasty_component_1_1) {
                toasty_component_1 = toasty_component_1_1;
            }],
        execute: function() {
            /**
             * Toasty is container for Toast components
             */
            Toasty = (function () {
                function Toasty(config, toastyService) {
                    this.config = config;
                    this.toastyService = toastyService;
                    // The storage for toasts.
                    this.toasts = [];
                }
                /**
                 * `ngOnInit` is called right after the directive's data-bound properties have been checked for the
                 * first time, and before any of its children have been checked. It is invoked only once when the
                 * directive is instantiated.
                 */
                Toasty.prototype.ngOnInit = function () {
                    var _this = this;
                    // We listen our service to recieve new toasts from it
                    this.toastyService.getToasts().subscribe(function (toast) {
                        // If we've gone over our limit, remove the earliest
                        // one from the array
                        if (_this.toasts.length >= _this.config.limit) {
                            _this.toasts.shift();
                        }
                        // Add toasty to array
                        _this.toasts.push(toast);
                        //
                        // If there's a timeout individually or globally,
                        // set the toast to timeout
                        if (toast.timeout) {
                            _this._setTimeout(toast);
                        }
                    });
                    // We listen clear all comes from service here.
                    this.toastyService.getClear().subscribe(function () {
                        // Lets clear all toasts
                        _this.clearAll();
                    });
                    if (this.position) {
                        var notFound = true;
                        for (var i = 0; i < Toasty.POSITIONS.length; i++) {
                            if (Toasty.POSITIONS[i] === this.position) {
                                notFound = false;
                                break;
                            }
                        }
                        if (notFound) {
                            // Position was wrong - clear it here to use the one from config.
                            this.position = this.config.position;
                        }
                    }
                    else {
                        this.position = this.config.position;
                    }
                    this.position = 'toasty-position-' + this.position;
                };
                /**
                 * Event listener of 'closeToast' event comes from ToastyComponent.
                 * This method removes ToastComponent assosiated with this Toast.
                 */
                Toasty.prototype.closeToast = function (toast) {
                    this.clear(toast.id);
                };
                /**
                 * Clear individual toast by id
                 * @param id is unique identifier of Toast
                 */
                Toasty.prototype.clear = function (id) {
                    var _this = this;
                    if (id) {
                        this.toasts.forEach(function (value, key) {
                            if (value.id === id) {
                                //scope.$broadcast('toasty-cleared', scope.toasty[key]);
                                if (value.onRemove && lang_1.isFunction(value.onRemove))
                                    value.onRemove.call(_this, value);
                                _this.toasts.splice(key, 1);
                            }
                        });
                    }
                    else {
                        throw new Error('Please provide id of Toast to close');
                    }
                };
                /**
                 * Clear all toasts
                 */
                Toasty.prototype.clearAll = function () {
                    var _this = this;
                    this.toasts.forEach(function (value, key) {
                        if (value.onRemove && lang_1.isFunction(value.onRemove))
                            value.onRemove.call(_this, value);
                    });
                    this.toasts = [];
                };
                /**
                 * Custom setTimeout function for specific setTimeouts on individual toasts.
                 */
                Toasty.prototype._setTimeout = function (toast) {
                    var _this = this;
                    window.setTimeout(function () {
                        _this.clear(toast.id);
                    }, toast.timeout);
                };
                /**
                 * Set of constants defins position of Toasty on the page.
                 */
                Toasty.POSITIONS = ['bottom-right', 'bottom-left', 'top-right', 'top-left', 'top-center', 'bottom-center'];
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], Toasty.prototype, "position", void 0);
                Toasty = __decorate([
                    core_1.Component({
                        selector: 'ng2-toasty',
                        encapsulation: core_1.ViewEncapsulation.None,
                        directives: [common_1.CORE_DIRECTIVES, toasty_component_1.Toast],
                        template: "\n    <div id=\"toasty\" [ngClass]=\"[position]\">\n        <ng2-toast *ngFor=\"let toast of toasts\" [toast]=\"toast\" (closeToast)=\"closeToast(toast)\"></ng2-toast>\n    </div>"
                    }), 
                    __metadata('design:paramtypes', [toasty_config_1.ToastyConfig, toasty_service_1.ToastyService])
                ], Toasty);
                return Toasty;
            }());
            exports_1("Toasty", Toasty);
        }
    }
});
//# sourceMappingURL=toasty.container.js.map