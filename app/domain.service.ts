import { Injectable } from '@angular/core';

import { UserManagementRoutes } from './usermanagement/routes';
import { RouteMetadata } from '@angular/router/src/metadata/metadata';
import {ForbiddenComponent} from './shared/security/forbidden/forbidden.component';
import {UnauthorizedComponent} from './shared/security/unauthorized/unauthorized.component';
import {LoginComponent} from './shared/security/login.component';
import {LogoutComponent} from './shared/security/logout.component';
import {WelcomeComponent} from './welcome/welcome.component';

@Injectable()
export class DomainService {
        
    public static getRoutes(): RouteMetadata[] {
        var baseRoutes: RouteMetadata[] = [    
            { path: '/Forbidden', component: ForbiddenComponent },
            { path: '/Unauthorized', component: UnauthorizedComponent },
            { path: '/Login', component: LoginComponent },
            { path: '/Logout', component: LogoutComponent }
        ];
        return baseRoutes
            .concat(UserManagementRoutes).concat([{ path: '/', component: WelcomeComponent }]);
    }
     
}