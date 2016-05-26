import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { XCoreServices } from '../service/core-services.service';
import { AppSettings } from '../../appsettings';
import { CookieService } from 'angular2-cookie/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class SecurityService {

    private storage: any;
    private appSettings: AppSettings;
    constructor(private cookieService: CookieService, private loggingService: LoggingService) {
        //Make sure to always create these appSettings new because injecting them creates a circular reference at the moment
        this.appSettings = new AppSettings();
        this.storage = localStorage;
        
        if (this.retrieve("xc.IsAuthorized") !== "") {
            this.HasAdminRole = this.retrieve("xc.HasAdminRole");
            this.IsAuthorized = this.retrieve("xc.IsAuthorized");
        }
    }

    public IsAuthorized: boolean;
    public HasAdminRole: boolean;

    public GetToken(): any {
        return this.retrieve("xc.authorizationData");
    }
    
    public ResetAuthorizationData() {
        this.store("xc.authorizationData", "");
        this.store("xc.authorizationDataIdToken", "");

        this.IsAuthorized = false;
        this.HasAdminRole = false;
        this.store("xc.HasAdminRole", false);
        this.store("xc.IsAuthorized", false);
    }

    public SetAuthorizationData(token: any, id_token:any) {
        if (this.retrieve("xc.authorizationData") !== "") {
            this.store("xc.authorizationData", "");
        }
        this.store("xc.authorizationData", token);
        this.store("xc.authorizationDataIdToken", id_token);
        this.IsAuthorized = true;
        this.store("xc.IsAuthorized", true);
    }

    public requestNewScopeAuthorization(scopes: string) {
        //Replace initial Hub Scopes with the proper scopes that the user will use
        //throughout the session
        this.Authorize(scopes);    
    }
    
    public Authorize(scopes?: string) {
        this.ResetAuthorizationData();


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
        
        window.location.href = url;
    }

    private retrieveTokensFromUrlHash(): any {
        //Attempt to retrieve tokens from hash        
        var hash = window.location.hash.substr(1);
        return hash.split('&').reduce(function (res, item) {
            var parts = item.split('=');
            res[parts[0]] = parts[1];
            return res;
        }, {});
        
    }
    
    private getUtcNowTicks(): number {
        return Math.floor(new Date().getTime() / 1000); 
    }
    
    private isTokenExpired(token: string): boolean {
        var dataToken: any = this.getDataFromToken(token);
        this.loggingService.debug('Checking for token expiration');
        if (!dataToken.exp || isNaN(parseInt(dataToken.exp)) || this.getUtcNowTicks() >= parseInt(dataToken.exp)) {
            this.loggingService.debug('Token is expired.  Cannot continue authorization');
            return true;
        }        
        return false;
    }

    private isCookieTokenValid(token: string, id_token: string): boolean {
        this.loggingService.debug('Found token and id token in cookies. Continuing check');
        if (this.isTokenExpired(token)) {
            this.ResetAuthorizationData();
            this.loggingService.warn('Could not validate authorization.  New login is required.', null, { noToast: true});
            return false;
        } else {
            this.SetAuthorizationData(token, id_token);
            this.loggingService.success('Authorization complete and valid (cookie)', { noToast:true });                
            return true;
        };        
    }    
    
    private isHashResultValid(error: string, state: string, access_token: string, id_token: string): boolean {
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
                        return true;
                    }                
                }
            }
        }
        return false;
    }
    public checkAuthorized(): boolean {

        this.loggingService.debug('Checking for valid authorization');
        
        //If stored in cookies then get tokens from there
        var token = this.cookieService.get("xc.authorizationData");
        var id_token = this.cookieService.get("xc.authorizationDataIdToken");        
        if (token && id_token) {
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

        return this.IsAuthorized;
    }

    public getUserName():string {
        var id_token = this.cookieService.get("xc.authorizationDataIdToken");
        if (id_token) {
            var dataIdToken: any = this.getDataFromToken(id_token);
            if (dataIdToken) return dataIdToken.given_name;             
        }
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
        this.ResetAuthorizationData();
        
            
        // var authServer = this._appSettings.IdentityServerEndpoint;
        // var authorizationUrl = `${authServer}/connect/endsession`;

        // var url =
        //     authorizationUrl + "?" +
        //     `post_logout_redirect_uri=${this._appSettings.ApiRedirectOnLogout}`;

        // window.location.href = url;
    }

    private urlBase64Decode(str) {
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

        return window.atob(output);
    }

    private getDataFromToken(token) {
        var data = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }

    private retrieve(key: string): any {
        //Check memory
        var item = this.storage.getItem(key);
        if (item && item !== 'undefined') {
            return JSON.parse(this.storage.getItem(key));
        }
        //Check cookie
        var cookieVal = this.cookieService.get(key) 
        if (cookieVal) {
            return JSON.parse(cookieVal);
        }        
        return;
    }

    private store(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
        this.cookieService.remove(key)
        if (value) this.cookieService.put(key, value)
    }

}
