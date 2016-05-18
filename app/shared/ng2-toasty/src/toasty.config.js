// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty
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
    var ToastyConfig;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * Default configuration foa all toats and toasty container
             */
            ToastyConfig = (function () {
                function ToastyConfig() {
                    // Maximum number of toasties to show at once
                    this.limit = 5;
                    // Whether to show the 'X' icon to close the toast
                    this.showClose = true;
                    // The window position where the toast pops up. Possible values
                    // bottom-right, bottom-left, top-right, top-left, top-center, bottom-center
                    this.position = 'bottom-right';
                    // How long (in miliseconds) the toasty shows before it's removed. Set to false to disable.
                    this.timeout = 5000;
                    // What theme to use. Possible values:
                    // default, material or bootstrap
                    this.theme = 'default';
                }
                ToastyConfig = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], ToastyConfig);
                return ToastyConfig;
            }());
            exports_1("ToastyConfig", ToastyConfig);
        }
    }
});
//# sourceMappingURL=toasty.config.js.map