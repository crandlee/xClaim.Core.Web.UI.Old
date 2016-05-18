import {Injectable} from '@angular/core';

@Injectable()
export class AppSettings {
    
    constructor() {}
    
    public get ApiEndpoint(): string { return 'http://localhost:10001/api' };
    public get IdentityServerEndpoint(): string { return 'https://www.localidentity.com:10000'};
    //public get IdentityServerEndpoint(): string { return 'http://localhost:5000'};   
    public get ApiRedirectOnLogin(): string { return `${window.location.protocol}//${window.location.host}`};
    public get ApiRedirectOnLogout():  string { return `${window.location.protocol}//${window.location.host}`};
    public get Client_Id(): string { return 'xclaim.webapi' };
    public get Scopes(): string { return 'xclaim.webapi.security openid email profile'};
    public get ResponseType(): string { return 'id_token token'};
    public get LoginRoute(): string { return '/Login'};
    public get LogoutRoute(): string { return '/Logout'};
    public get CookieKeys(): ICookieKeys { return { 
        RouteAfterLoginKey: 'xc.routeAfterLogin'
    }};
    
}


export interface ICookieKeys {
    RouteAfterLoginKey: string;
}