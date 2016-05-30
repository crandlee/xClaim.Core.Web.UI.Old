import {Injectable} from '@angular/core';

@Injectable()
export class AppSettings {
    
    constructor() {}
    
    public get IdentityServerEndpoint(): string { return 'http://192.168.1.147:10001'};
    //public get IdentityServerEndpoint(): string { return 'http://localhost:5000'};   
    public get ApiRedirectOnLogin(): string { return `${window.location.protocol}//${window.location.host}`};
    public get ApiRedirectOnLogout():  string { return `${window.location.protocol}//${window.location.host}`};
    public get HubApiEndpoint(): string { return 'http://192.168.1.147:5000/api' };
    public get HubController(): string { return 'Hub'};
    public get ApiClientId(): string { return 'xclaim.web.api' };
    public get HubScopes(): string { return 'openid profile xclaim.hub'};
    public get ResponseType(): string { return 'id_token token'};
    public get LoginRoute(): string { return '/Login'};
    public get LogoutRoute(): string { return '/Logout'};
    public get CookieKeys(): ICookieKeys { return { 
        RouteAfterLoginKey: 'xc.routeAfterLogin'
    }};
    public get MinimumLogLevel(): LogLevel {return LogLevel.Debug }
}


export enum LogLevel {
    Trace,
    Debug,
    Info,
    Success,
    Warn,
    Error,
    None
}

export interface ICookieKeys {
    RouteAfterLoginKey: string;
}