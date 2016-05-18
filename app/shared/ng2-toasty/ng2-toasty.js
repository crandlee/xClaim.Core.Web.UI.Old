// Copyright (C) 2016 Sergey Akopkokhyants
// This project is licensed under the terms of the MIT license.
// https://github.com/akserg/ng2-toasty
System.register(['./src/toasty.container', './src/toasty.component', './src/toasty.config', './src/toasty.service'], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var toasty_container_1, toasty_component_1, toasty_config_1, toasty_service_1;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (toasty_container_1_1) {
                toasty_container_1 = toasty_container_1_1;
                exportStar_1(toasty_container_1_1);
            },
            function (toasty_component_1_1) {
                toasty_component_1 = toasty_component_1_1;
                exportStar_1(toasty_component_1_1);
            },
            function (toasty_config_1_1) {
                toasty_config_1 = toasty_config_1_1;
                exportStar_1(toasty_config_1_1);
            },
            function (toasty_service_1_1) {
                toasty_service_1 = toasty_service_1_1;
                exportStar_1(toasty_service_1_1);
            }],
        execute: function() {
            exports_1("default",{
                providers: [toasty_config_1.ToastyConfig, toasty_service_1.ToastyService],
                directives: [toasty_container_1.Toasty, toasty_component_1.Toast]
            });
        }
    }
});
//# sourceMappingURL=ng2-toasty.js.map