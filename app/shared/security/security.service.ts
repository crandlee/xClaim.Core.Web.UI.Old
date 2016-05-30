import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { XCoreServices } from '../service/core-services.service';
import { AppSettings } from '../../appsettings';
import { CookieService } from 'angular2-cookie/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { LoggingService, TraceMethodPosition } from '../logging/logging.service';
import { BusyService } from '../service/busy.service';

@Injectable()
export class SecurityService {

    private storage: any;
    private appSettings: AppSettings;
    
    private classTrace: (methodName: string) => (methodPosition: TraceMethodPosition, extraMessage?: string) => void;
    
    constructor(private cookieService: CookieService, private loggingService: LoggingService, private busyService: BusyService) {
        
        //Make sure to always create these appSettings new because injecting them creates a circular reference at the moment
        this.appSettings = new AppSettings();
        this.storage = localStorage;
        
        this.classTrace = this.loggingService.getTraceFunction("SecurityService");
        
        if (this.retrieve("xc.IsAuthorized") !== "") {
            this.HasAdminRole = this.retrieve("xc.HasAdminRole");
            this.IsAuthorized = this.retrieve("xc.IsAuthorized");
        }
    }

    public IsAuthorized: boolean;
    public HasAdminRole: boolean;

    public GetToken(): any {
        var trace = this.classTrace("getToken");
        trace(TraceMethodPosition.Entry);
        var ret = this.retrieve("xc.authorizationData");
        trace(TraceMethodPosition.Exit);
        return ret;
    }
    
    public ResetAuthorizationData() {
        var trace = this.classTrace("ResetAuthorizationData");
        trace(TraceMethodPosition.Entry);

        this.store("xc.authorizationData", "");
        this.store("xc.authorizationDataIdToken", "");

        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.store("xc.HasAdminRole", false);
        this.store("xc.IsAuthorized", false);
        
        trace(TraceMethodPosition.Exit);

    }

    public SetAuthorizationData(token: any, id_token:any) {
        
        var trace = this.classTrace("SetAuthorizationData");
        trace(TraceMethodPosition.Entry);
        
        if (this.retrieve("xc.authorizationData") !== "") {
            this.store("xc.authorizationData", "");
        }
        this.store("xc.authorizationData", token);
        this.store("xc.authorizationDataIdToken", id_token);
        this.IsAuthorized = true;
        this.store("xc.IsAuthorized", true);
        
        trace(TraceMethodPosition.Exit);
    }

    public requestNewScopeAuthorization(scopes: string) {
        
        var trace = this.classTrace("requestNewScopeAuthorization");
        trace(TraceMethodPosition.Entry);

        //Replace initial Hub Scopes with the proper scopes that the user will use
        //throughout the session
        this.Authorize(scopes);    
        
        trace(TraceMethodPosition.Exit);
    }
    
    public Authorize(scopes?: string) {
        
        var trace = this.classTrace("Authorize");
        trace(TraceMethodPosition.Entry);
        
        this.ResetAuthorizationData();

        this.busyService.notifyBusy(true);
        var authServer = this.appSettings.IdentityServerEndpoint;
        
        var authorizationUrl = `${authServer}/connect/authorize`;
        var client_id = this.appSettings.ApiClientId;
        var redirect_uri = this.appSettings.ApiRedirectOnLogin;
        var response_type = this.appSettings.ResponseType;
        var scopeRequest = scopes || this.appSettings.HubScopes;
        var nonce = "N" + Math.random() + "" + Date.now();
        var state = Date.now() + "" + Math.random();

        this.loggingService.debug(`Begin authorization, requesting scopes [${scopeRequest}]`);

        this.store("xc.authStateControl", state);
        this.store("xc.authNonce", nonce);
        //this.loggingService.debug("AuthorizedController created. adding myautostate: " + this.retrieve("authStateControl"));

        var url =
            authorizationUrl + "?" +
            "response_type=" + encodeURI(response_type) + "&" +
            "client_id=" + encodeURI(client_id) + "&" +
            "redirect_uri=" + encodeURI(redirect_uri) + "&" +
            "scope=" + encodeURI(scopeRequest) + "&" +
            "nonce=" + encodeURI(nonce) + "&" +
            "state=" + encodeURI(state);
        
        trace(TraceMethodPosition.Exit);
        window.location.href = url;
    }

    private retrieveTokensFromUrlHash(): any {
        
        var trace = this.classTrace("retrieveTokensFromUrlHash");
        trace(TraceMethodPosition.Entry);

        //Attempt to retrieve tokens from hash        
        var hash = window.location.hash.substr(1);
        var ret = hash.split('&').reduce(function (res, item) {
            var parts = item.split('=');
            res[parts[0]] = parts[1];
            return res;
        }, {});
        trace(TraceMethodPosition.Exit);
        return ret;
    }
    
    private getUtcNowTicks(): number {
        return Math.floor(new Date().getTime() / 1000); 
    }
    
    private isTokenExpired(token: string): boolean {
        
        var trace = this.classTrace("isTokenExpired");
        trace(TraceMethodPosition.Entry);

        var dataToken: any = this.getDataFromToken(token);
        var ret:boolean = false;
        this.loggingService.debug('Checking for token expiration');
        if (!dataToken.exp || isNaN(parseInt(dataToken.exp)) || this.getUtcNowTicks() >= parseInt(dataToken.exp)) {
            this.loggingService.debug('Token is expired.  Cannot continue authorization');
            ret = true;
        } else {
            ret = false;    
        }   
             
        trace(TraceMethodPosition.Exit);
        return ret;
        
    }

    private isCookieTokenValid(token: string, id_token: string): boolean {
        var trace = this.classTrace("isCookieTokenValid");
        trace(TraceMethodPosition.Entry);
        
        this.loggingService.debug('Found token and id token in cookies. Continuing check');
        if (this.isTokenExpired(token)) {
            this.ResetAuthorizationData();
            this.loggingService.warn('Could not validate authorization.  New login is required.', null, { noToast: true});
            trace(TraceMethodPosition.Exit);
            return false;
        } else {
            this.SetAuthorizationData(token, id_token);
            this.loggingService.success('Authorization complete and valid (cookie)', { noToast:true });
            trace(TraceMethodPosition.Exit);                
            return true;
        };        
    }    
    
    private isHashResultValid(error: string, state: string, access_token: string, id_token: string): boolean {
        var trace = this.classTrace("isHashResultValid");
        trace(TraceMethodPosition.Entry);
        
        if (!error) {
            if (!state || state == this.retrieve("xc.authStateControl")) {

                if (access_token && id_token) {
                    
                    this.loggingService.debug("Retrieved token and id token in hash. Continuing check.");                    
                    
                    var dataIdToken: any = this.getDataFromToken(id_token);
                    if (this.isTokenExpired(access_token)) return false;
                    
                    // validate nonce
                    if (dataIdToken.nonce == this.retrieve("xc.authNonce")) {
                        this.store("xc.authNonce", "");
                        this.store("xc.authStateControl", "");
                        this.loggingService.success('Authorization Successful', { noToast: true });
                        trace(TraceMethodPosition.Entry);
                        return true;
                    }                
                }
            }
        }
        trace(TraceMethodPosition.Exit);
        return false;
    }
    public checkAuthorized(): boolean {

        var trace = this.classTrace("checkAuthorized");
        trace(TraceMethodPosition.Entry);

        this.loggingService.debug('Checking for valid authorization');
        
        //If stored in cookies then get tokens from there
        var token = this.cookieService.get("xc.authorizationData");
        var id_token = this.cookieService.get("xc.authorizationDataIdToken");        
        if (token && id_token) {
            trace(TraceMethodPosition.Exit);
            return this.isCookieTokenValid(token, id_token);
        }
        
        //Check hash for tokens
        this.ResetAuthorizationData();                
        var hashResult: any = this.retrieveTokensFromUrlHash();        
        if (this.isHashResultValid(hashResult.error, hashResult.state, hashResult.access_token, hashResult.id_token)) {
            this.SetAuthorizationData(hashResult.access_token, hashResult.id_token);
            this.loggingService.success('Authorization complete and valid (hash)', { noToast: true});
        }
        else {
            this.ResetAuthorizationData();
            this.loggingService.warn('No valid authorization found', null, { noToast: true });
        }

        trace(TraceMethodPosition.Exit);
        return this.IsAuthorized;
    }

    public getUserName():string {

        var trace = this.classTrace("getUserName");
        trace(TraceMethodPosition.Entry);
        
        var id_token = this.cookieService.get("xc.authorizationDataIdToken");
        if (id_token) {
            var dataIdToken: any = this.getDataFromToken(id_token);
            if (dataIdToken) {
                trace(TraceMethodPosition.Exit); 
                return dataIdToken.given_name;
            }
        }
        
        trace(TraceMethodPosition.Exit);
        return "";
    }

    public getCurrentScopes():string {
        var token = this.cookieService.get("xc.authorizationData");
        if (token) {
            var accessToken: any = this.getDataFromToken(token);
            if (accessToken) return accessToken.scope.join(" ");             
        }
        return "";
    }
    
    public Logoff() {
        
        var trace = this.classTrace("Logoff");
        trace(TraceMethodPosition.Entry);

        this.ResetAuthorizationData();
        
            
        // var authServer = this._appSettings.IdentityServerEndpoint;
        // var authorizationUrl = `${authServer}/connect/endsession`;

        // var url =
        //     authorizationUrl + "?" +
        //     `post_logout_redirect_uri=${this._appSettings.ApiRedirectOnLogout}`;

        trace(TraceMethodPosition.Exit);

        // window.location.href = url;
    }

    private urlBase64Decode(str) {
        
        var trace = this.classTrace("urlBase64Decode");
        trace(TraceMethodPosition.Entry);

        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }

        var ret = window.atob(output);
        trace(TraceMethodPosition.Exit);
        return ret;
    }

    private getDataFromToken(token) {

        var trace = this.classTrace("getDataFromToken");
        trace(TraceMethodPosition.Entry);
        
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        trace(TraceMethodPosition.Exit);
        return data;
    }

    private retrieve(key: string): any {
        
        var trace = this.classTrace("retrieve");
        trace(TraceMethodPosition.Entry, key);

        //Check memory
        var item = this.storage.getItem(key);
        if (item && item !== 'undefined') {
            return JSON.parse(this.storage.getItem(key));
        }
        //Check cookie
        var cookieVal = this.cookieService.get(key) 
        if (cookieVal) {
            trace(TraceMethodPosition.Exit);
            return JSON.parse(cookieVal);
        }        
        
        trace(TraceMethodPosition.Exit, key);
        return;
    }

    private store(key: string, value: any) {
        
        var trace = this.classTrace("store");
        trace(TraceMethodPosition.Entry, key);

        this.storage.setItem(key, JSON.stringify(value));
        this.cookieService.remove(key);
        if (value) this.cookieService.put(key, value);
        
        trace(TraceMethodPosition.Exit, key);
    }

}
