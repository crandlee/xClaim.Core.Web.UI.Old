System.register(['../usermanagement/userprofile.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var userprofile_component_1;
    var UserManagementRoutes;
    return {
        setters:[
            function (userprofile_component_1_1) {
                userprofile_component_1 = userprofile_component_1_1;
            }],
        execute: function() {
            exports_1("UserManagementRoutes", UserManagementRoutes = [
                { path: '/UserProfile', component: userprofile_component_1.UserProfileComponent }
            ]);
        }
    }
});
//# sourceMappingURL=routes.js.map