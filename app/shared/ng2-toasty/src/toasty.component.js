// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty
System.register(['@angular/core', '@angular/common'], function(exports_1, context_1) {
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
    var core_1, common_1;
    var Toast;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            /**
             * A Toast component shows message with title and close button.
             */
            Toast = (function () {
                function Toast() {
                    this.closeToastEvent = new core_1.EventEmitter();
                }
                /**
                 * Event handler invokes when user clicks on close button.
                 * This method emit new event into ToastyContainer to close it.
                 */
                Toast.prototype.close = function ($event) {
                    $event.preventDefault();
                    this.closeToastEvent.next(this.toast);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], Toast.prototype, "toast", void 0);
                __decorate([
                    core_1.Output('closeToast'), 
                    __metadata('design:type', Object)
                ], Toast.prototype, "closeToastEvent", void 0);
                Toast = __decorate([
                    core_1.Component({
                        selector: 'ng2-toast',
                        directives: [common_1.CORE_DIRECTIVES],
                        template: "\n        <div class=\"toast\" [ngClass]=\"[toast.type, toast.theme]\">\n            <div *ngIf=\"toast.showClose\" class=\"close-button\" (click)=\"close($event)\"></div>\n            <div *ngIf=\"toast.title || toast.msg\" class=\"toast-text\">\n                <span *ngIf=\"toast.title\" class=\"toast-title\">{{toast.title}}</span>\n                <br *ngIf=\"toast.title && toast.msg\" />\n                <span *ngIf=\"toast.msg\" class=\"toast-msg\">{{toast.msg}}</span>\n            </div>\n        </div>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], Toast);
                return Toast;
            }());
            exports_1("Toast", Toast);
        }
    }
});
//# sourceMappingURL=toasty.component.js.map