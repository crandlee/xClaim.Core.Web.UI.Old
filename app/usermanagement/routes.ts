import { RouteMetadata } from '@angular/router/src/metadata/metadata';
import { UserProfileComponent } from '../usermanagement/userprofile.component';
import { UserManagementComponent } from '../usermanagement/usermanagement.component';
import { UserComponent } from '../usermanagement/user.component';

export var UserManagementRoutes: RouteMetadata[] =  [
    { path: '/UserProfile', component: UserProfileComponent },
    { path: '/UserManagement', component: UserManagementComponent },
    { path: '/User/:id', component: UserComponent },
    { path: '/NewUser', component: UserComponent }
];

