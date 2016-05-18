// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty
System.register(['@angular/core', '@angular/platform-browser/src/facade/lang', 'rxjs/Observable', './toasty.config'], function(exports_1, context_1) {
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
    var core_1, lang_1, Observable_1, toasty_config_1;
    var ToastyService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (lang_1_1) {
                lang_1 = lang_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (toasty_config_1_1) {
                toasty_config_1 = toasty_config_1_1;
            }],
        execute: function() {
            /**
             * Toasty service helps create different kinds of Toasts
             */
            ToastyService = (function () {
                function ToastyService(config) {
                    var _this = this;
                    this.config = config;
                    // Init the counter
                    this.uniqueCounter = 0;
                    this.toastsObservable = new Observable_1.Observable(function (subscriber) {
                        _this.toastsSubscriber = subscriber;
                    });
                    this.clearObservable = new Observable_1.Observable(function (subscriber) {
                        _this.clearSubscriber = subscriber;
                    });
                }
                /**
                 * Get list of toats
                 */
                ToastyService.prototype.getToasts = function () {
                    return this.toastsObservable;
                };
                ToastyService.prototype.getClear = function () {
                    return this.clearObservable;
                };
                /**
                 * Create Toast of a default type
                 */
                ToastyService.prototype.default = function (options) {
                    this.add(options, 'default');
                };
                /**
                 * Create Toast of default type
                 * @param  {object} options Individual toasty config overrides
                 */
                ToastyService.prototype.info = function (options) {
                    this.add(options, 'info');
                };
                /**
                 * Create Toast of success type
                 * @param  {object} options Individual toasty config overrides
                 */
                ToastyService.prototype.success = function (options) {
                    this.add(options, 'success');
                };
                /**
                 * Create Toast of wait type
                 * @param  {object} options Individual toasty config overrides
                 */
                ToastyService.prototype.wait = function (options) {
                    this.add(options, 'wait');
                };
                /**
                 * Create Toast of error type
                 * @param  {object} options Individual toasty config overrides
                 */
                ToastyService.prototype.error = function (options) {
                    this.add(options, 'error');
                };
                /**
                 * Create Toast of warning type
                 * @param  {object} options Individual toasty config overrides
                 */
                ToastyService.prototype.warning = function (options) {
                    this.add(options, 'warning');
                };
                // Add a new toast item
                ToastyService.prototype.add = function (options, type) {
                    var toastyOptions;
                    if (lang_1.isString(options) && options !== '' || lang_1.isNumber(options)) {
                        toastyOptions = {
                            title: options.toString()
                        };
                    }
                    else {
                        toastyOptions = options;
                    }
                    if (!toastyOptions || !toastyOptions.title && !toastyOptions.msg) {
                        throw new Error('ng2-toasty: No toast title or message specified!');
                    }
                    type = type || 'default';
                    // Set a unique counter for an id
                    this.uniqueCounter++;
                    // Set the local vs global config items
                    var showClose = this._checkConfigItem(this.config, toastyOptions, 'showClose');
                    // If we have a theme set, make sure it's a valid one
                    var theme;
                    if (toastyOptions.theme) {
                        theme = ToastyService.THEMES.indexOf(toastyOptions.theme) > -1 ? toastyOptions.theme : this.config.theme;
                    }
                    else {
                        theme = this.config.theme;
                    }
                    var toast = {
                        id: this.uniqueCounter,
                        title: toastyOptions.title,
                        msg: toastyOptions.msg,
                        showClose: showClose,
                        type: 'toasty-type-' + type,
                        theme: 'toasty-theme-' + theme,
                        onAdd: toastyOptions.onAdd && lang_1.isFunction(toastyOptions.onAdd) ? toastyOptions.onAdd : null,
                        onRemove: toastyOptions.onRemove && lang_1.isFunction(toastyOptions.onRemove) ? toastyOptions.onRemove : null
                    };
                    // If there's a timeout individually or globally,
                    // set the toast to timeout
                    if (toastyOptions.timeout) {
                        toast.timeout = toastyOptions.timeout || this.config.timeout;
                    }
                    else {
                        toast.timeout = null;
                    }
                    // Push up a new toast item
                    try {
                        this.toastsSubscriber.next(toast);
                        // If we have a onAdd function, call it here
                        if (toastyOptions.onAdd && lang_1.isFunction(toastyOptions.onAdd)) {
                            toastyOptions.onAdd.call(this, toast);
                        }
                    }
                    catch (e) {
                        console.log(e);
                        console.log('!!! Suggestion: Seems you forget add <ng2-toasty></ng2-toasty> into your html?');
                    }
                };
                // Clear all toasts
                ToastyService.prototype.clearAll = function () {
                    this.clearSubscriber.next();
                };
                // Checks whether the local option is set, if not,
                // checks the global config
                ToastyService.prototype._checkConfigItem = function (config, options, property) {
                    if (options[property] === false) {
                        return false;
                    }
                    else if (!options[property]) {
                        return config[property];
                    }
                    else {
                        return true;
                    }
                };
                // Allowed THEMES
                ToastyService.THEMES = ['default', 'material', 'bootstrap'];
                ToastyService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [toasty_config_1.ToastyConfig])
                ], ToastyService);
                return ToastyService;
            }());
            exports_1("ToastyService", ToastyService);
        }
    }
});
//# sourceMappingURL=toasty.service.js.map