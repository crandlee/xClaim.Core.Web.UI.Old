System.register(['../usermanagement/userprofile.component', '../usermanagement/user.list.component', '../usermanagement/user.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var userprofile_component_1, user_list_component_1, user_component_1;
    var UserManagementRoutes;
    return {
        setters:[
            function (userprofile_component_1_1) {
                userprofile_component_1 = userprofile_component_1_1;
            },
            function (user_list_component_1_1) {
                user_list_component_1 = user_list_component_1_1;
            },
            function (user_component_1_1) {
                user_component_1 = user_component_1_1;
            }],
        execute: function() {
            exports_1("UserManagementRoutes", UserManagementRoutes = [
                { path: '/UserProfile', component: userprofile_component_1.UserProfileComponent },
                { path: '/UserList', component: user_list_component_1.UserListComponent },
                { path: '/User/:id', component: user_component_1.UserComponent },
                { path: '/NewUser', component: user_component_1.UserComponent }
            ]);
        }
    }
});
//# sourceMappingURL=routes.js.map