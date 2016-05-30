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
                    this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("UnspecifiedService");
                }
                XCoreBaseComponent.prototype.initializeTrace = function (className) {
                    this.classTrace = this.xCoreServices.LoggingService.getTraceFunction(className);
                };
                XCoreBaseComponent.prototype.NotifyLoaded = function (componentName) {
                    this.xCoreServices.LoggingService.info("Component: " + componentName, { noToast: true });
                    this.xCoreServices.LoggingService.info("Route: " + (this.xCoreServices.Router.serializeUrl(this.xCoreServices.Router.urlTree) || "root"), { noToast: true });
                };
                return XCoreBaseComponent;
            }());
            exports_1("XCoreBaseComponent", XCoreBaseComponent);
        }
    }
});
//# sourceMappingURL=base.component.js.map