import { AppSettings } from '../appsettings';

import { RouteMetadata } from '@angular/router/src/metadata/metadata';
import { UserProfileComponent } from '../usermanagement/userprofile.component';
import { UserListComponent } from '../usermanagement/user.list.component';
import { UserComponent } from '../usermanagement/user.component';


export var UserManagementRoutes: RouteMetadata[] =  [
    { path: '/UserProfile', component: UserProfileComponent },
    { path: '/UserList', component: UserListComponent },
    { path: '/User/:id', component: UserComponent },
    { path: '/NewUser', component: UserComponent }
];

