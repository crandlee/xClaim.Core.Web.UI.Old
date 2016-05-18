System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var XCoreBaseComponent;
    return {
        setters:[],
        execute: function() {
            XCoreBaseComponent = (function () {
                function XCoreBaseComponent(xCoreServices) {
                    this.xCoreServices = xCoreServices;
                }
                XCoreBaseComponent.prototype.ngOnInit = function () {
                    this.xCoreServices.LoggingService.info("Loaded " + this.xCoreServices.Router.serializeUrl(this.xCoreServices.Router.urlTree), { noToast: true });
                };
                return XCoreBaseComponent;
            }());
            exports_1("XCoreBaseComponent", XCoreBaseComponent);
        }
    }
});
//# sourceMappingURL=base.component.js.map